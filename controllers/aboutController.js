// backend/controllers/aboutController.js
import { conectarBD } from '../dbconnection.js';

export async function getAbout(req, res) {
  const db = await conectarBD();
  const [rows] = await db.execute('SELECT * FROM about LIMIT 1');
  res.json(rows[0]);
}

export async function updateAbout(req, res) {
  const db = await conectarBD();
  const { id } = req.params;
  const { texto } = req.body;
  await db.execute('UPDATE about SET texto = ? WHERE id = ?', [texto, id]);
  res.json({ mensaje: 'About actualizado' });
}
