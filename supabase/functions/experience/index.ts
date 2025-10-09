// backend/supabase/functions/experience/index.ts

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
  const path = url.pathname.replace('/experience', '')
  const method = req.method

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  try {
    // ─── GET ALL EXPERIENCE ────────────────────────────────
    if (method === 'GET' && (path === '' || path === '/')){
      const result = await sql`SELECT * FROM experience`
      return corsJson(result)
    }

    // ─── CREATE EXPERIENCE ─────────────────────────────────
    if (method === 'POST' && (path === '' || path === '/')) {
      const { experiencia, anio } = await req.json()
      await sql`INSERT INTO experience (experiencia, anio) VALUES (${experiencia}, ${anio})`
      return corsJson({ mensaje: 'Experiencia agregada' })
    }

    // ─── UPDATE EXPERIENCE ─────────────────────────────────
    if (method === 'PUT' && path.startsWith('/')) {
      const id = path.split('/')[1]
      const { experiencia, anio } = await req.json()
      await sql`UPDATE experience SET experiencia = ${experiencia}, anio = ${anio} WHERE id = ${id}`
      return corsJson({ mensaje: 'Experiencia actualizada' })
    }

    // ─── DELETE EXPERIENCE ─────────────────────────────────
    if (method === 'DELETE' && path.startsWith('/')) {
      const id = path.split('/')[1]
      await sql`DELETE FROM experience WHERE id = ${id}`
      return corsJson({ mensaje: 'Experiencia eliminada' })
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
