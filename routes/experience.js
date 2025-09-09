// backend/routes/experience.js
import express from 'express';
import { getExperience, addExperience, updateExperience, deleteExperience } from '../controllers/experienceController.js';

const router = express.Router();

router.get('/', getExperience);
router.post('/', addExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

export default router;
