// backend/supabase/functions/backend/index.ts

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
  const path = url.pathname.replace('/backend', '')
  const method = req.method

  // ─── CORS PRE-FLIGHT ─────────────────────────────────────
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    })
  }

  try {
    // ─── ADMIN ──────────────────────────────────────────────
    if (path === '/admin/verificar' && method === 'POST') {
      const { email, password } = await req.json()

      const res = await fetch('https://nkijprmbdzgmhvqvshmv.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('ANON_KEY')
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        return corsJson({ mensaje: 'Acceso concedido', token: data.access_token })
      } else {
        return corsJson({ error: 'Credenciales inválidas' }, 401)
      }
    }

    // ─── CONTACT ────────────────────────────────────────────
    if (path === '/contact/mensaje' && method === 'POST') {
      const { nombre, email, mensaje } = await req.json()
      if (!nombre || !email || !mensaje) {
        return corsJson({ error: 'Faltan campos obligatorios' }, 400)
      }

      await sql`INSERT INTO mensajes (nombre, email, mensaje) VALUES (${nombre}, ${email}, ${mensaje})`

      return corsJson({ mensaje: 'Mensaje guardado correctamente (correo no enviado)' })
    }

    // ─── DEFAULT ────────────────────────────────────────────
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
