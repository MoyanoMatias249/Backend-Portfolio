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
    const result = await sql`SELECT id FROM admin_config LIMIT 1`;

    if (result.length > 0) {
      console.log('Contraseña ya configurada');
      return;
    }
    const hash = await bcrypt.hash(contraseña, 10);
    await sql`INSERT INTO admin_config (password_hash) VALUES (${hash})`;
    console.log('Contraseña insertada automáticamente');
  } catch (error) {
    console.error('Error al asegurar contraseña admin:', error);
  }
}

asegurarContraseñaAdmin();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
