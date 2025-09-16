// backend/scripts/setPassword.js
import sql from '../db.js';
import bcrypt from 'bcrypt';

const contraseña = '5796';
const hash = await bcrypt.hash(contraseña, 10);

// Si ya existe, actualizá. Si no, insertá.
const existe = await sql`SELECT id FROM admin_config LIMIT 1`;

if (existe.length > 0) {
  await sql`UPDATE admin_config SET password_hash = ${hash} WHERE id = ${existe[0].id}`;
  console.log('Contraseña actualizada');
} else {
  await sql`INSERT INTO admin_config (password_hash) VALUES (${hash})`;
  console.log('Contraseña creada');
}

process.exit();
