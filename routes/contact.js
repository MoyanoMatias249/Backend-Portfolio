// backend/routes/contact.js
import express from 'express';
import { getDestino, addMensaje } from '../controllers/contactController.js';

const router = express.Router();

router.get('/destino', getDestino);       
router.post('/mensaje', addMensaje);     

export default router;
