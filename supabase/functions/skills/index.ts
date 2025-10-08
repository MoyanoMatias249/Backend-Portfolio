// backend/supabase/functions/skills/index.ts

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
  const path = url.pathname.replace('/skills', '')
  const method = req.method

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  try {
    // ─── GET ALL SKILLS ────────────────────────────────────
    if (method === 'GET' && (path === '' || path === '/')){
      const result = await sql`SELECT * FROM skills`
      return corsJson(result)
    }

    // ─── CREATE SKILL ──────────────────────────────────────
    if (method === 'POST' && path === '/') {
      const { nombre, nivel, descripcion, icono } = await req.json()
      await sql`
        INSERT INTO skills (nombre, nivel, descripcion, icono)
        VALUES (${nombre}, ${nivel}, ${descripcion}, ${icono})
      `
      return corsJson({ mensaje: 'Skill agregada' })
    }

    // ─── UPDATE SKILL ──────────────────────────────────────
    if (method === 'PUT' && path.startsWith('/')) {
      const id = path.split('/')[1]
      const { nombre, nivel, descripcion, icono } = await req.json()
      await sql`
        UPDATE skills SET nombre = ${nombre}, nivel = ${nivel},
        descripcion = ${descripcion}, icono = ${icono} WHERE id = ${id}
      `
      return corsJson({ mensaje: 'Skill actualizada' })
    }

    // ─── DELETE SKILL ──────────────────────────────────────
    if (method === 'DELETE' && path.startsWith('/')) {
      const id = path.split('/')[1]
      await sql`DELETE FROM skills WHERE id = ${id}`
      return corsJson({ mensaje: 'Skill eliminada' })
    }

    return new Response('Ruta no encontrada', { status: 404, headers: corsHeaders() })
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
