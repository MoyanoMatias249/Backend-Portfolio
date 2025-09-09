// backend/controllers/skillsController.js
import { conectarBD } from '../dbconnection.js';

export async function getSkills(req, res) {
  const db = await conectarBD();
  const [rows] = await db.execute('SELECT * FROM skills');
  res.json(rows);
}

export async function addSkill(req, res) {
  const db = await conectarBD();
  const { nombre, nivel } = req.body;
  await db.execute('INSERT INTO skills (nombre, nivel) VALUES (?, ?)', [nombre, nivel]);
  res.json({ mensaje: 'Skill agregada' });
}

export async function updateSkill(req, res) {
  const db = await conectarBD();
  const { id } = req.params;
  const { nombre, nivel } = req.body;
  await db.execute('UPDATE skills SET nombre = ?, nivel = ? WHERE id = ?', [nombre, nivel, id]);
  res.json({ mensaje: 'Skill actualizada' });
}

export async function deleteSkill(req, res) {
  const db = await conectarBD();
  const { id } = req.params;
  await db.execute('DELETE FROM skills WHERE id = ?', [id]);
  res.json({ mensaje: 'Skill eliminada' });
}
