import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './../connect.js';
import { verifyAuth, getTokenFromCookie } from './ControllerUtils.js';

const signToken = (id) => {
  return jwt.sign(
    {
      _id: id,
    },
    'V1cwd05VMUdWWGxQVmxKaFZqQTFOVmRzYUZOVVJuQlpZWG93UFE9PQ==',
    {
      expiresIn: '31d',
    }
  );
};

const isEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const GetUserInfoById = async (id, callback) => {
  const q =
    'SELECT id, username, firstname, lastname, isAdmin FROM users WHERE id = ?';

  db.query(q, [id], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows[0]);
    }
  });
};

export const CreateUser = async (req, res, next) => {
  try {
    const q = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(q, [req.body.username, req.body.email], async (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json('User already exists!');
      //CREATE A NEW USER

      //password hashing
      const pwd = req.body.password;

      bcrypt
        .genSalt(10)
        .then((salt) => {
          return bcrypt.hash(pwd, salt);
        })
        .then((hash) => {
          const q =
            'INSERT INTO users (`username`,`email`,`password`,`firstname`, `lastname`) VALUE (?)';

          const values = [
            req.body.username,
            req.body.email,
            hash,
            req.body.firstname,
            req.body.lastname,
          ];

          db.query(q, [values], (err, data) => {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            }
            const uId = data.insertId;
            const token = signToken(uId);
            return res
              .cookie('user_token', token, {
                httpOnly: true,
                maxAge: 31 * 24 * 60 * 60 * 1000,
              })
              .status(200)
              .json({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                id: uId,
              });
          });
        });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'User creation failed',
    });
  }
};

export const AuthUser = async (req, res) => {
  try {
    const q =
      'SELECT `id`, `firstname`, `lastname`, `password` FROM users WHERE `username` = ? OR `email` = ?';
    db.query(q, [req.body.userLogin, req.body.userLogin], async (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json('User not found!');
      //console.log('d', data[0]);

      const checkPassword = await bcrypt.compare(
        req.body.password,
        data[0].password,
        (err, rez) => {
          if (err) {
            console.log('e', err);
            return res.status(500).json('auth failed.');
          } else if (rez) {
            const token = signToken(data[0].id);
            const { password, ...userInfo } = data[0];
            return res
              .cookie('user_token', token, {
                httpOnly: true,
                maxAge: 31 * 24 * 60 * 60 * 1000,
              })
              .status(200)
              .json(userInfo);
          } else {
            console.log(rez);
            return res.status(400).json('Invalid password');
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Oooops... We've run into error :(");
  }
};

export const UserLogout = (req, resp) => {
  console.log(req);
  resp
    .clearCookie('user_token', { secure: true, sameSite: 'none', path: '/' })
    .status(200)
    .json('Logged out');
};

export const getCurrentUserInfo = async (req, res) => {
  if (req.headers.cookie === undefined || req.query.id === undefined) {
    res.status(409).json('no data');
  }
  const uId = decodeURI(req.query.id);
  if (verifyAuth(req.headers.cookie, uId)) {
    const q =
      'SELECT `firstname`, `lastname`, `email` from `users` where `id` = ?';

    db.query(q, [req.query.id], (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json('error');
      } else {
        return res.status(200).json(data[0]);
      }
    });
  } else {
    res.status(409).json('token is invalid');
  }
};

export const updateMyProfile = async (req, res) => {
  console.log(req.body);
  if (req.headers.cookie === undefined || req.params.id === undefined) {
    res.status(409).json('no data');
  }

  let hashedPwd = await selectHashedPasswordById(req.params.id);
  let arePasswordsMatching = await comparePasswords(
    req.body.password,
    hashedPwd
  );
  if (arePasswordsMatching) {
    let newPassword =
      req.body.new_password !== '' && req.body.new_password !== undefined
        ? await bcrypt.hash(req.body.new_password, 10)
        : hashedPwd;

    const q =
      'UPDATE `users` SET `password`=?,`email`=?,`firstname`=?,`lastname`=? WHERE id = ?';

    console.log('np', hashedPwd);
    const values = [
      newPassword,
      req.body.email,
      req.body.firstname,
      req.body.lastname,
      req.params.id,
    ];

    db.query(q, values, (err, result) => {
      if (result) {
        return res.status(200).json({
          id: req.params.id,
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
        });
      } else if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: 'Oops.. something went wrong :(' });
      }
    });
  } else {
    console.log('returning');
    return res.status(401).json({ error: 'Current password does not match' });
  }
};

const selectHashedPasswordById = (userId) => {
  const q = 'SELECT `password` FROM `users` WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(q, [userId], (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data[0].password);
      }
    });
  });
};

const comparePasswords = (plainPassword, hashedPassword) => {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(plainPassword, hashedPassword, function (err, res) {
      if (err) {
        reject(err);
      } else {
        console.log(res);
        resolve(res);
      }
    });
  });
};

export const selectUserData = (uId) => {
  const q = 'SELECT `firstname`, `lastname` from `users` where `id` = ?';

  db.query(q, [uId], (err, data) => {
    if (err) {
      return 'error';
    } else {
      return data[0];
    }
  });
};
