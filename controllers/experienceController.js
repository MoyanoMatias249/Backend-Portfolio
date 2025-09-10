// backend/controllers/experienceController.js
import sql from '../db.js'

export async function getExperience(req, res) {
  const result = await sql`SELECT * FROM experience`
  res.json(result)
}
export async function addExperience(req, res) {
  const { experiencia, anio } = req.body
  await sql`INSERT INTO experience (experiencia, anio) VALUES (${experiencia}, ${anio})`
  res.json({ mensaje: 'Experiencia agregada' })
}

export async function updateExperience(req, res) {
  const { id } = req.params
  const { experiencia, anio } = req.body
  await sql`UPDATE experience SET experiencia = ${experiencia}, anio = ${anio} WHERE id = ${id}`
  res.json({ mensaje: 'Experiencia actualizada' })
}

export async function deleteExperience(req, res) {
  const { id } = req.params
  await sql`DELETE FROM experience WHERE id = ${id}`
  res.json({ mensaje: 'Experiencia eliminada' })
}