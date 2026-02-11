import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../config/prisma.js';
import { createAuditLog } from '../services/audit.service.js';

export const getExpenses = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const expenses = await prisma.expense.findMany({
            where: { companyId: req.user.companyId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(expenses);
    } catch (error) {
        console.error('[GetExpenses Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
    const { amount, currency, description, category } = req.body;
    const receiptUrl = req.file ? `/uploads/receipts/${req.file.filename}` : null;

    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(amount),
                currency: currency || 'SAR',
                description,
                category,
                receiptUrl,
                userId: req.user.id,
                companyId: req.user.companyId,
                status: 'PENDING'
            }
        });

        await createAuditLog(req.user.id, req.user.companyId, 'CREATE_EXPENSE', { expenseId: expense.id, amount });

        res.status(201).json(expense);
    } catch (error) {
        console.error('[CreateExpense Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateExpenseStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const expense = await prisma.expense.update({
            where: { id: id as string },
            data: { status }
        });

        await createAuditLog(req.user.id, req.user.companyId, 'UPDATE_EXPENSE_STATUS', { expenseId: id, status });

        res.json(expense);
    } catch (error) {
        console.error('[UpdateExpenseStatus Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
