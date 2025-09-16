// backend/routes/admin.js
import express from 'express';
import { verificarAdmin } from '../controllers/adminController.js';

const router = express.Router();
router.post('/verificar', verificarAdmin);
export default router;
