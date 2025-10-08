// backend/supabase/functions/about/index.ts

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
  const path = url.pathname.replace('/about', '')
  const method = req.method

  // ─── CORS PRE-FLIGHT ─────────────────────────────────────
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    })
  }

  try {
    // ─── GET ABOUT ─────────────────────────────────────────
    if (method === 'GET' && (path === '' || path === '/')){
      const result = await sql`SELECT * FROM about LIMIT 1`
      return corsJson(result[0])
    }

    // ─── UPDATE ABOUT ──────────────────────────────────────
    if (method === 'PUT' && path.startsWith('/')) {
      const id = path.split('/')[1]
      const { texto } = await req.json()
      await sql`UPDATE about SET texto = ${texto} WHERE id = ${id}`
      return corsJson({ mensaje: 'About actualizado' })
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
