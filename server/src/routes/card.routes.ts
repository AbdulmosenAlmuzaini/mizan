import { Router } from 'express';
import { getCards, createCard, toggleCardStatus } from '../controllers/card.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

// All card routes require authentication
router.use(authenticate as any);

router.get('/', getCards as any);
router.post('/', authorize([Role.ADMIN]) as any, createCard as any);
router.patch('/:id/toggle', authorize([Role.ADMIN]) as any, toggleCardStatus as any);

export default router;
