# Backend – Supabase Functions + Express

Este proyecto contiene dos enfoques de backend:

## Supabase Functions (`/supabase/functions`)

Cada entidad del sistema está implementada como una función independiente:

- `about`, `experience`, `projects`, `skills`: CRUD completo.
- `backend`: funciones para contacto y verificación de administrador.

Las funciones se invocan desde el frontend mediante HTTP. Los datos se guardan en la base de datos de Supabase.

## Backend clásico con Express (`/controllers`, `/routes`, `/db`)

Versión original del backend, útil para desarrollo local:

- Encripta contraseñas.
- Envía correos desde el formulario de contacto.
- Usa rutas REST tradicionales.
