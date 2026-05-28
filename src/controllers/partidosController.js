const pool = require('../config/database');

const getPartidos = async (req, res) => {
  try {
    const { estado } = req.query;
    
    let query = `
      SELECT 
        id, grupo, fecha_hora, equipo_local, equipo_visitante,
        bandera_local, bandera_visitante, goles_local, goles_visitante,
        estado
      FROM partidos
    `;
    
    if (estado) {
      query += ` WHERE estado = $1 ORDER BY fecha_hora ASC`;
      const result = await pool.query(query, [estado]);
      return res.status(200).json({
        error: false,
        code: 200,
        data: result.rows.map(p => ({
          id: p.id,
          grupo: p.grupo,
          fechaHora: p.fecha_hora,
          equipoLocal: p.equipo_local,
          equipoVisitante: p.equipo_visitante,
          banderaLocal: p.bandera_local,
          banderaVisitante: p.bandera_visitante,
          golesLocal: p.goles_local,
          golesVisitante: p.goles_visitante,
          estado: p.estado,
          prediccionBloqueada: p.estado !== 'PENDIENTE'
        }))
      });
    } else {
      query += ` ORDER BY fecha_hora ASC`;
      const result = await pool.query(query);
      return res.status(200).json({
        error: false,
        code: 200,
        data: result.rows.map(p => ({
          id: p.id,
          grupo: p.grupo,
          fechaHora: p.fecha_hora,
          equipoLocal: p.equipo_local,
          equipoVisitante: p.equipo_visitante,
          banderaLocal: p.bandera_local,
          banderaVisitante: p.bandera_visitante,
          golesLocal: p.goles_local,
          golesVisitante: p.goles_visitante,
          estado: p.estado,
          prediccionBloqueada: p.estado !== 'PENDIENTE'
        }))
      });
    }
  } catch (error) {
    console.error('Error getPartidos:', error);
    return res.status(500).json({ 
      error: true, 
      code: 500, 
      data: { error: 'Error interno' } 
    });
  }
};

module.exports = { getPartidos };