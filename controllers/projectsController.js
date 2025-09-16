// backend/controllers/projectsController.js
import sql from '../db.js'

// Mostrar Proyectos
export async function getProjects(req, res) {
  const projects = await sql`SELECT * FROM projects`
  const techs = await sql`SELECT project_id, tecnologia FROM project_tech`
  // Agrupar tecnologías por proyecto
  const techMap = {}
  techs.forEach(({ project_id, tecnologia }) => {
    if (!techMap[project_id]) techMap[project_id] = []
    techMap[project_id].push(tecnologia)
  })
  // Combinar proyectos con sus tecnologías
  const enriched = projects.map(p => ({
    ...p,
    tech: techMap[p.id] || []
  }))

  res.json(enriched)
}

// Agregar un nuevo Proyecto
export async function addProject(req, res) {
  const { titulo, descripcion, captura, repo, tech = [] } = req.body
  const result = await sql`
    INSERT INTO projects (titulo, descripcion, captura, repo)
    VALUES (${titulo}, ${descripcion}, ${captura}, ${repo})
    RETURNING id
  `
  const projectId = result[0].id

  for (const tecnologia of tech) {
    await sql`INSERT INTO project_tech (project_id, tecnologia) VALUES (${projectId}, ${tecnologia})`
  }

  res.json({ mensaje: 'Proyecto agregado', id: projectId })
}

// Actualizar un Proyecto
export async function updateProject(req, res) {
  const { id } = req.params
  const { titulo, descripcion, captura, repo, tech = [] } = req.body

  await sql`
    UPDATE projects SET titulo = ${titulo}, descripcion = ${descripcion},
    captura = ${captura}, repo = ${repo} WHERE id = ${id}
  `
  await sql`DELETE FROM project_tech WHERE project_id = ${id}`

  for (const tecnologia of tech) {
    await sql`INSERT INTO project_tech (project_id, tecnologia) VALUES (${id}, ${tecnologia})`
  }

  res.json({ mensaje: 'Proyecto actualizado' })
}

// Borrar un Proyecto
export async function deleteProject(req, res) {
  const { id } = req.params
  await sql`DELETE FROM project_tech WHERE project_id = ${id}`
  await sql`DELETE FROM projects WHERE id = ${id}`
  res.json({ mensaje: 'Proyecto eliminado' })
}