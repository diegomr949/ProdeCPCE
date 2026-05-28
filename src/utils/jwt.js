const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateToken = (userId, userRole) => {
  return jwt.sign(
    { userId, userRole },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken, decodeToken };