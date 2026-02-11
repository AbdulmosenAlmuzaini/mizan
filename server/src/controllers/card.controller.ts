import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../config/prisma.js';
import { createAuditLog } from '../services/audit.service.js';

export const getCards = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const cards = await prisma.card.findMany({
            where: { companyId: req.user.companyId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(cards);
    } catch (error) {
        console.error('[GetCards Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createCard = async (req: AuthRequest, res: Response) => {
    const { lastFour, expiry, limit } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const card = await prisma.card.create({
            data: {
                lastFour,
                expiry,
                limit: parseFloat(limit),
                companyId: req.user.companyId,
                active: 'true'
            }
        });

        await createAuditLog(req.user.id, req.user.companyId, 'CREATE_CARD', { cardId: card.id, lastFour });

        res.status(201).json(card);
    } catch (error) {
        console.error('[CreateCard Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const toggleCardStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { active } = req.body; // "true" or "false" as string per schema

    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const card = await prisma.card.update({
            where: { id: id as string },
            data: { active: String(active) }
        });

        await createAuditLog(req.user.id, req.user.companyId, 'TOGGLE_CARD_STATUS', { cardId: id, active });

        res.json(card);
    } catch (error) {
        console.error('[ToggleCardStatus Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
