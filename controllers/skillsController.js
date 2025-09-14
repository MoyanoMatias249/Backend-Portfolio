// backend/controllers/skillsController.js
import sql from '../db.js'

export async function getSkills(req, res) {
  const result = await sql`SELECT * FROM skills`
  res.json(result)
}

export async function addSkill(req, res) {
  const { nombre, nivel, descripcion, icono } = req.body;
  await sql`
    INSERT INTO skills (nombre, nivel, descripcion, icono)
    VALUES (${nombre}, ${nivel}, ${descripcion}, ${icono})
  `;
  res.json({ mensaje: 'Skill agregada' });
}


export async function updateSkill(req, res) {
  const { id } = req.params;
  const { nombre, nivel, descripcion, icono } = req.body;
  await sql`
    UPDATE skills
    SET nombre = ${nombre}, nivel = ${nivel}, descripcion = ${descripcion}, icono = ${icono}
    WHERE id = ${id}
  `;
  res.json({ mensaje: 'Skill actualizada' });
}


export async function deleteSkill(req, res) {
  const { id } = req.params
  await sql`DELETE FROM skills WHERE id = ${id}`
  res.json({ mensaje: 'Skill eliminada' })
}