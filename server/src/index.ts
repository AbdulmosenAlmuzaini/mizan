import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import cardRoutes from './routes/card.routes.js';

import budgetRoutes from './routes/budget.routes.js';
import auditRoutes from './routes/audit.routes.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve static files from the React app
const __dirname = path.resolve();
const clientPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientPath));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/audit', auditRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mizan API is running', timestamp: new Date() });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`[server]: Mizan Server is running at http://localhost:${port}`);
});

export { app, prisma };
