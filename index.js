// backend/index.js
import express from 'express';
import cors from 'cors';

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
