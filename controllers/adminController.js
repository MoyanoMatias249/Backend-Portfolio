// backend/controllers/adminController.js
import sql from '../db.js';
import bcrypt from 'bcrypt';

export async function verificarAdmin(req, res) {
  const { password } = req.body;
  const result = await sql`SELECT password_hash FROM admin_config LIMIT 1`;
  const hash = result[0]?.password_hash;

  if (!hash) return res.status(500).json({ error: 'No hay contraseña configurada' });

  const match = await bcrypt.compare(password, hash);
  if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

  res.json({ mensaje: 'Acceso concedido' });
}
