import { Router } from 'express';
import { getBudgets, createBudget, updateBudget } from '../controllers/budget.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

// All budget routes require authentication
router.use(authenticate as any);

router.get('/', getBudgets as any);
router.post('/', authorize([Role.ADMIN, Role.ACCOUNTANT]) as any, createBudget as any);
router.put('/:id', authorize([Role.ADMIN, Role.ACCOUNTANT]) as any, updateBudget as any);

export default router;
