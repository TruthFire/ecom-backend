import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

export const verifyTokenAndId = (token, uid) => {
  try {
    var tkn = getTokenValues(token);
    uid = parseInt(uid);
    return tkn._id === uid;
  } catch (err) {
    console.log(err);
  }
};

export const getTokenFromCookie = (req_cookies) => {
  var CookieObject = {};
  const cookiesArray = req_cookies.split(';');
  cookiesArray.forEach((cookie) => {
    const [key, value] = cookie.trim().split('=');
    CookieObject[key] = value;
  });

  return CookieObject.user_token;
};

export const getTokenValues = (token) => {
  return jwt.verify(
    token,
    'V1cwd05VMUdWWGxQVmxKaFZqQTFOVmRzYUZOVVJuQlpZWG93UFE9PQ=='
  );
};

export const verifyAuth = (cookies, id) => {
  const tkn = getTokenFromCookie(cookies);
  console.log(getTokenValues(tkn), id);
  return parseInt(getTokenValues(tkn)._id) === parseInt(id);
};

export const getIdFromCookie = (cookie) => {
  return getTokenValues(getTokenFromCookie(cookie))._id;
};
