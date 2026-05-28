const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: true, 
        code: 400, 
        data: { error: 'Email y contraseña requeridos' } 
      });
    }

    const result = await pool.query(
      'SELECT id, nombre, email, rol, area FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: true, 
        code: 401, 
        data: { error: 'Credenciales incorrectas' } 
      });
    }

    const user = result.rows[0];
    const passwordMatch = await comparePassword(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ 
        error: true, 
        code: 401, 
        data: { error: 'Credenciales incorrectas' } 
      });
    }

    const token = generateToken(user.id, user.rol);

    return res.status(200).json({
      error: false,
      code: 200,
      data: {
        token,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        area: user.area
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      error: true, 
      code: 500, 
      data: { error: 'Error interno del servidor' } 
    });
  }
};

// REGISTRO
const register = async (req, res) => {
  try {
    const { nombre, email, password, area } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: true, 
        code: 400, 
        data: { error: 'Datos incompletos' } 
      });
    }

    // Verificar si existe
    const existing = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ 
        error: true, 
        code: 400, 
        data: { error: 'El email ya está registrado' } 
      });
    }

    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, area, rol, puntos_totales, plenos_totales) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nombre, email, rol, area',
      [nombre, email, hashedPassword, area || null, 'ROLE_USER', 0, 0]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.rol);

    return res.status(201).json({
      error: false,
      code: 201,
      data: {
        token,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        area: user.area
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ 
      error: true, 
      code: 500, 
      data: { error: 'Error interno del servidor' } 
    });
  }
};

// GET ME
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, area FROM usuarios WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: true, 
        code: 404, 
        data: { error: 'Usuario no encontrado' } 
      });
    }

    const user = result.rows[0];
    return res.status(200).json({
      error: false,
      code: 200,
      data: user
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    return res.status(500).json({ 
      error: true, 
      code: 500, 
      data: { error: 'Error interno del servidor' } 
    });
  }
};

module.exports = { login, register, getMe };