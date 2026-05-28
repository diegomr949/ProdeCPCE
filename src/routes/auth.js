const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/auth/login', login);
router.post('/auth/registro', register);
router.get('/auth/me', authMiddleware, getMe);

module.exports = router;