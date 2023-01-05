import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './../connect.js';
import { getUIDFromTkn } from './ControllerUtils.js';

export const GetRecentOrders = async (req, res) => {
  try {
    const q =
      'SELECT id, user_id, order_price, placed_at FROM user_order WHERE status = "Paid" ORDER BY `id` DESC LIMIT 10';

    db.query(q, (err, data) => {
      if (data) {
        return res.status(200).json(data);
      } else {
        console.log(err.message);
        throw err;
      }
    });
  } catch (error) {
    return res.status(500).json(err.message);
  }
};

export const getTodayTurnover = async (req, res) => {
  try {
    const q = `SELECT sum(order_price) AS turnover FROM user_order WHERE placed_at >= CURDATE()
  AND placed_at < CURDATE() + INTERVAL 1 DAY`;
    db.query(q, (err, data) => {
      if (data) {
        return res.status(200).json(data);
      } else {
        console.log(err.message);
        throw err;
      }
    });
  } catch (error) {
    return res.status(500).json(err.message);
  }
};

export const getUserStats = async (req, res) => {
  try {
    const queries = [
      `SELECT COUNT(*) as userCount FROM users`,
      `SELECT COUNT(*) as registeredToday FROM users WHERE CreatedAt >= CURDATE()
  AND createdAt < CURDATE() + INTERVAL 1 DAY`,
    ];
    db.query(queries.join(';'), (err, data) => {
      if (data) {
        return res.status(200).json({
          stats: {
            userCount: data[0][0].userCount,
            registeredToday: data[1][0].registeredToday,
          },
        });
      } else {
        console.log(err.message);
        throw err;
      }
    });
  } catch (error) {
    return res.status(404).json({ msg: 'Not found' });
  }
};

export const GetUserList = async (req, res) => {
  try {
    const q = `SELECT id,firstname,lastname,createdAt,email FROM users WHERE 1;`;
    db.query(q, (err, data) => {
      if (data) {
        return res.status(200).json(data);
      } else {
        console.log(err);
        throw err;
      }
    });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserInfo = async (req, res) => {
  const q =
    'SELECT `username`, `firstname`, `lastname`, `email`, createdAt, isAdmin, isBanned from `users` where `id` = ?';

  db.query(q, [req.params.id], (err, data) => {
    if (data && data.length > 0) {
      return res.status(200).json({ user: data[0] });
    } else if (data.length === 0) {
      return res.status(404).json({ message: 'Not found' });
    } else {
      console.log(err);
      return res.status(500).json('error');
    }
  });
};

export const AuthAdm = async (req, res) => {
  if (req.headers.cookie === undefined) {
    res.status(409).json('no data');
  }
  const userId = getUIDFromTkn(req.headers.cookie);
  if (userId) {
    const q = 'SELECT `isAdmin` from `users` where `id` = ?';

    db.query(q, [userId], (err, data) => {
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

export const updateUser = async (req, res) => {
  // Extract values from request body
  const { username, firstname, lastname, email, isAdmin, isBanned } = req.body;
  // Check if new password is provided before calling bcrypt.hash()

  // Use template literals and object destructuring to create the query string and values array
  const q =
    'UPDATE `users` SET `username`=?, `email`=?,`firstname`=?,`lastname`=?, `isAdmin`=?, `isBanned`=? WHERE id = ?';
  const values = [
    username,
    email,
    firstname,
    lastname,
    isAdmin,
    isBanned,
    req.params.id,
  ];

  try {
    const result = await db.query(q, values);

    return res.status(200).json({
      id: req.params.id,
      email,
      firstname,
      lastname,
      isAdmin,
      isBanned,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops.. something went wrong :(' });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const queries = [
      `SELECT COUNT(*) as orderCount FROM user_order`,
      `SELECT COUNT(*) as orderedToday FROM user_order WHERE placed_at >= CURDATE()
  AND placed_at < CURDATE() + INTERVAL 1 DAY`,
    ];
    db.query(queries.join(';'), (err, data) => {
      if (data) {
        return res.status(200).json({
          stats: {
            orders: data[0][0].orderCount,
            ordersToday: data[1][0].orderedToday,
          },
        });
      } else {
        console.log(err.message);
        throw err;
      }
    });
  } catch (error) {
    return res.status(404).json({ msg: 'Not found' });
  }
};
