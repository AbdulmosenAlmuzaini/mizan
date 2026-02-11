import { Router } from 'express';
import { getExpenses, createExpense, updateExpenseStatus } from '../controllers/expense.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { uploadReceipt } from '../middleware/upload.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

// All expense routes require authentication
router.use(authenticate as any);

router.get('/', getExpenses as any);
router.post('/', uploadReceipt.single('receipt'), createExpense as any);
router.patch('/:id/status', authorize([Role.ADMIN, Role.ACCOUNTANT]) as any, updateExpenseStatus as any);

export default router;
