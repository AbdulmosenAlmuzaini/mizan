import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../config/prisma.js';

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const logs = await prisma.auditLog.findMany({
            where: { companyId: req.user.companyId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit to latest 100 logs
        });

        res.json(logs);
    } catch (error) {
        console.error('[GetAuditLogs Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
