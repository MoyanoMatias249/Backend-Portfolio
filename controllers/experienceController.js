// backend/controllers/experienceController.js
import { conectarBD } from '../dbconnection.js';

export async function getExperience(req, res) {
  const db = await conectarBD();
  const [rows] = await db.execute('SELECT * FROM experience');
  res.json(rows);
}

export async function addExperience(req, res) {
  const db = await conectarBD();
  const { empresa, puesto, periodo } = req.body;
  await db.execute('INSERT INTO experience (empresa, puesto, periodo) VALUES (?, ?, ?)', [empresa, puesto, periodo]);
  res.json({ mensaje: 'Experiencia agregada' });
}

export async function updateExperience(req, res) {
  const db = await conectarBD();
  const { id } = req.params;
  const { empresa, puesto, periodo } = req.body;
  await db.execute('UPDATE experience SET empresa = ?, puesto = ?, periodo = ? WHERE id = ?', [empresa, puesto, periodo, id]);
  res.json({ mensaje: 'Experiencia actualizada' });
}

export async function deleteExperience(req, res) {
  const db = await conectarBD();
  const { id } = req.params;
  await db.execute('DELETE FROM experience WHERE id = ?', [id]);
  res.json({ mensaje: 'Experiencia eliminada' });
}
