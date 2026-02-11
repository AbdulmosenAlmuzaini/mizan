import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../config/prisma.js';
import { createAuditLog } from '../services/audit.service.js';

export const getBudgets = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const budgets = await prisma.budget.findMany({
            where: { companyId: req.user.companyId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(budgets);
    } catch (error) {
        console.error('[GetBudgets Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createBudget = async (req: AuthRequest, res: Response) => {
    const { name, amount } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const budget = await prisma.budget.create({
            data: {
                name,
                amount: parseFloat(amount),
                companyId: req.user.companyId
            }
        });

        await createAuditLog(req.user.id, req.user.companyId, 'CREATE_BUDGET', { budgetId: budget.id, name, amount });

        res.status(201).json(budget);
    } catch (error) {
        console.error('[CreateBudget Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, amount } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const budget = await prisma.budget.update({
            where: { id: id as string },
            data: {
                name,
                amount: amount ? parseFloat(amount) : undefined
            }
        });

        await createAuditLog(req.user.id, req.user.companyId, 'UPDATE_BUDGET', { budgetId: id, name, amount });

        res.json(budget);
    } catch (error) {
        console.error('[UpdateBudget Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
