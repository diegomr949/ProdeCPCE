const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;
  
  if (!token) {
    return res.status(401).json({ error: true, code: 401, data: { error: 'Token requerido' } });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: true, code: 401, data: { error: 'Token inválido o expirado' } });
  }

  req.user = decoded;
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.userRole !== 'ROLE_ADMIN') {
    return res.status(403).json({ error: true, code: 403, data: { error: 'Acceso denegado' } });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };