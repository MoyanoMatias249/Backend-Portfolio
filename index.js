// backend/index.js
import express from 'express';
import cors from 'cors';
import sql from './db.js';
import bcrypt from 'bcrypt';

import aboutRoutes from './routes/about.js';
import skillsRoutes from './routes/skills.js';
import projectsRoutes from './routes/projects.js';
import experienceRoutes from './routes/experience.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

sql`SELECT 1`.then(() => console.log('Conexión OK')).catch(err => console.error('Error de conexión:', err));

// Rutas
app.use('/api/about', aboutRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Definir contraseña para modo Admin
async function asegurarContraseñaAdmin() {
  try {
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
  } catch (error) {
    console.error('Error al asegurar contraseña admin:', error);
  }
}

asegurarContraseñaAdmin();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
