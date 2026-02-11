import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { createAuditLog } from '../services/audit.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req: Request, res: Response) => {
    const {
        email,
        password,
        firstName,
        lastName,
        companyName
    } = req.body;

    try {
        // 1. Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // 2. Create Company
        const company = await prisma.company.create({
            data: { name: companyName }
        });

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User (Admin)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'ADMIN',
                companyId: company.id
            }
        });

        // 5. Create Audit Log
        await createAuditLog(user.id, company.id, 'REGISTER', { email: user.email });

        res.status(201).json({
            message: 'Registration successful',
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('[Registration Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Create Audit Log
        await createAuditLog(user.id, user.companyId, 'LOGIN');

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                companyName: user.company.name
            }
        });
    } catch (error) {
        console.error('[Login Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
