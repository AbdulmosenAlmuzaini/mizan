import prisma from '../config/prisma.js';

export const createAuditLog = async (
    userId: string,
    companyId: string,
    action: string,
    details?: any
) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                companyId,
                action,
                details: typeof details === 'string' ? details : JSON.stringify(details),
            },
        });
    } catch (error) {
        console.error('[AuditLog Error]:', error);
    }
};
