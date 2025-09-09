// backend/controllers/projectsController.js
import { conectarBD } from '../dbconnection.js';

export async function getProjects(req, res) {
  const db = await conectarBD();

  const [projects] = await db.execute('SELECT * FROM projects');
  const [techs] = await db.execute('SELECT project_id, tecnologia FROM project_tech');

  // Agrupar tecnologías por proyecto
  const techMap = {};
  techs.forEach(({ project_id, tecnologia }) => {
    if (!techMap[project_id]) techMap[project_id] = [];
    techMap[project_id].push(tecnologia);
  });

  // Combinar proyectos con sus tecnologías
  const enrichedProjects = projects.map(project => ({
    ...project,
    tech: techMap[project.id] || []
  }));
    console.log("Ejecutando getProjects con tecnologías...");
  res.json(enrichedProjects);
}

export async function addProject(req, res) {
  const db = await conectarBD();
  const { titulo, descripcion, captura, repo, tech = [] } = req.body;

  // Insertar proyecto
  const [result] = await db.execute(
    'INSERT INTO projects (titulo, descripcion, captura, repo) VALUES (?, ?, ?, ?)',
    [titulo, descripcion, captura, repo]
  );

  const projectId = result.insertId;

  // Insertar tecnologías asociadas
  for (const tecnologia of tech) {
    await db.execute(
      'INSERT INTO project_tech (project_id, tecnologia) VALUES (?, ?)',
      [projectId, tecnologia]
    );
  }

  res.json({ mensaje: 'Proyecto y tecnologías agregados', id: projectId });
}

export async function updateProject(req, res) {
  const db = await conectarBD();
  const { id } = req.params;
  const { titulo, descripcion, captura, repo, tech = [] } = req.body;

  // Actualizar proyecto
  await db.execute(
    'UPDATE projects SET titulo = ?, descripcion = ?, captura = ?, repo = ? WHERE id = ?',
    [titulo, descripcion, captura, repo, id]
  );

  // Eliminar tecnologías anteriores
  await db.execute('DELETE FROM project_tech WHERE project_id = ?', [id]);

  // Insertar nuevas tecnologías
  for (const tecnologia of tech) {
    await db.execute(
      'INSERT INTO project_tech (project_id, tecnologia) VALUES (?, ?)',
      [id, tecnologia]
    );
  }

  res.json({ mensaje: 'Proyecto y tecnologías actualizados' });
}

export async function deleteProject(req, res) {
  const db = await conectarBD();
  const { id } = req.params;

  // Eliminar tecnologías asociadas
  await db.execute('DELETE FROM project_tech WHERE project_id = ?', [id]);

  // Eliminar proyecto
  await db.execute('DELETE FROM projects WHERE id = ?', [id]);

  res.json({ mensaje: 'Proyecto y tecnologías eliminados' });
}
