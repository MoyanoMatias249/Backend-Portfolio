// backend/controllers/aboutController.js
import sql  from '../db.js';

export async function getAbout(req, res) {
  const result = await sql`SELECT * FROM about LIMIT 1`
  res.json(result[0])
}

export async function updateAbout(req, res) {
  const { id } = req.params
  const { texto } = req.body
  await sql`UPDATE about SET texto = ${texto} WHERE id = ${id}`
  res.json({ mensaje: 'About actualizado' })
}