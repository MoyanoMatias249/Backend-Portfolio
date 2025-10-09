// backend/supabase/functions/projects/index.ts

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import postgres from "https://deno.land/x/postgresjs/mod.js"

const sql = postgres(Deno.env.get('DATABASE_URL'), {
  ssl: 'require',
  prepare: false,
  idle_timeout: 5,
  connect_timeout: 10
})

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname.replace('/projects', '')
  const method = req.method

  // ─── CORS PRE-FLIGHT ─────────────────────────────────────
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    })
  }

  try {
    // ─── GET ALL PROJECTS ──────────────────────────────────
    if (method === 'GET' && (path === '' || path === '/')){
      const projects = await sql`SELECT * FROM projects`
      const techs = await sql`SELECT project_id, tecnologia FROM project_tech`
      const techMap: Record<number, string[]> = {}
      techs.forEach(({ project_id, tecnologia }) => {
        if (!techMap[project_id]) techMap[project_id] = []
        techMap[project_id].push(tecnologia)
      })
      const enriched = projects.map(p => ({
        ...p,
        tech: techMap[p.id] || []
      }))
      return corsJson(enriched)
    }

    // ─── CREATE PROJECT ────────────────────────────────────
    if (method === 'POST' && (path === '' || path === '/')) {
      const { titulo, descripcion, captura, repo, tech = [] } = await req.json()
      const result = await sql`
        INSERT INTO projects (titulo, descripcion, captura, repo)
        VALUES (${titulo}, ${descripcion}, ${captura}, ${repo})
        RETURNING id
      `
      const projectId = result[0].id
      for (const tecnologia of tech) {
        await sql`INSERT INTO project_tech (project_id, tecnologia) VALUES (${projectId}, ${tecnologia})`
      }
      return corsJson({ mensaje: 'Proyecto agregado', id: projectId })
    }

    // ─── UPDATE PROJECT ────────────────────────────────────
    if (method === 'PUT' && path.startsWith('/')) {
      const id = path.split('/')[1]
      const { titulo, descripcion, captura, repo, tech = [] } = await req.json()
      await sql`
        UPDATE projects SET titulo = ${titulo}, descripcion = ${descripcion},
        captura = ${captura}, repo = ${repo} WHERE id = ${id}
      `
      await sql`DELETE FROM project_tech WHERE project_id = ${id}`
      for (const tecnologia of tech) {
        await sql`INSERT INTO project_tech (project_id, tecnologia) VALUES (${id}, ${tecnologia})`
      }
      return corsJson({ mensaje: 'Proyecto actualizado' })
    }

    // ─── DELETE PROJECT ────────────────────────────────────
    if (method === 'DELETE' && path.startsWith('/')) {
      const id = path.split('/')[1]
      await sql`DELETE FROM project_tech WHERE project_id = ${id}`
      await sql`DELETE FROM projects WHERE id = ${id}`
      return corsJson({ mensaje: 'Proyecto eliminado' })
    }

    // ─── DEFAULT ───────────────────────────────────────────
    return new Response('Ruta no encontrada', {
      status: 404,
      headers: corsHeaders()
    })
  } catch (error) {
    console.error('Error en función:', error)
    return corsJson({ error: 'Error interno del servidor' }, 500)
  }
})

function corsJson(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders()
  })
}

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*'
  }
}
