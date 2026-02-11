import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Plus,
    Calendar,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { expenseAPI, type Expense } from '../services/api';
import { useNavigate } from 'react-router-dom';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Dashboard: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const data = await expenseAPI.getAll();
            setExpenses(data || []);
        } catch (err) {
            console.error('Failed to fetch expenses:', err);
        } finally {
            setLoading(false);
        }
    };

    const monthlyExpenses = expenses
        .filter(exp => new Date(exp.createdAt).getMonth() === new Date().getMonth())
        .reduce((sum, exp) => sum + exp.amount, 0);

    const stats = [
        { title: 'إجمالي الرصيد', label: 'Total Balance', amount: '124,500.00', currency: 'SAR', trend: '+12%', icon: Wallet, color: 'border-emerald-500', iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { title: 'مصاريف الشهر', label: 'Monthly Expenses', amount: monthlyExpenses.toLocaleString(), currency: 'SAR', trend: '-5%', icon: TrendingDown, color: 'border-rose-500', iconColor: 'text-rose-600', bgColor: 'bg-rose-50' },
        { title: 'الميزانية المتبقية', label: 'الميزانية', amount: '79,289', currency: 'SAR', trend: '76%', icon: TrendingUp, color: 'border-amber-500', iconColor: 'text-amber-600', bgColor: 'bg-amber-50' },
    ];

    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                        الرئيسية
                    </h1>
                    <p className="text-slate-500 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        نظرة عامة على نشاطك المالي وتحليلات الرصيد
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-50 px-6 py-3.5 rounded-2xl text-[10px] font-black text-slate-500 hover:bg-slate-100 transition-all active-scale flex items-center gap-2 border border-slate-100 uppercase tracking-widest">
                        <Calendar size={14} />
                        <span>آخر 30 يوم</span>
                    </button>
                    <button
                        onClick={() => navigate('/expenses')}
                        className="bg-primary-600 hover:bg-primary-500 px-8 py-3.5 rounded-2xl text-[10px] font-black text-white shadow-lg shadow-primary-600/20 transition-all active-scale flex items-center gap-2 group uppercase tracking-widest"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span>إضافة عملية</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={stat.label}
                        className={cn(
                            "bg-white rounded-[32px] p-8 border-2 transition-all hover:shadow-xl hover:-translate-y-1 group active-scale",
                            stat.color
                        )}
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bgColor)}>
                                <stat.icon size={26} className={stat.iconColor} />
                            </div>
                            <div className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black tracking-wider border",
                                stat.trend.startsWith('+') || stat.trend.includes('%') && !stat.trend.startsWith('-')
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                    : "bg-rose-50 border-rose-100 text-rose-600"
                            )}>
                                {stat.trend}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                {stat.title}
                            </p>
                            <h3 className="text-3xl font-black text-slate-900 flex items-baseline gap-2 tabular-nums">
                                {stat.amount}
                                <span className="text-xs font-bold text-slate-400 tracking-widest">{stat.currency}</span>
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity Area */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">العمليات الأخيرة</h3>
                    <button
                        onClick={() => navigate('/expenses')}
                        className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-500 transition-colors"
                    >
                        عرض الكل
                    </button>
                </div>

                <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-50">
                        {loading ? (
                            <div className="p-20 flex items-center justify-center">
                                <Loader2 className="animate-spin text-primary-600" size={32} />
                            </div>
                        ) : recentExpenses.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                    <Wallet className="text-slate-300" size={32} />
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">لا يوجد عمليات مؤخراً</p>
                            </div>
                        ) : (
                            recentExpenses.map((expense, i) => (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={expense.id}
                                    className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                                    onClick={() => navigate('/expenses')}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg transition-all group-hover:scale-110 group-hover:bg-primary-50 group-hover:text-primary-600">
                                            {expense.category[0].toUpperCase()}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors text-lg tracking-tight">
                                                {expense.category}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                                                    expense.status === 'COMPLETED'
                                                        ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                                        : "bg-amber-50 border-amber-100 text-amber-600"
                                                )}>
                                                    {expense.status === 'COMPLETED' ? 'مكتمل' : 'قيد المعالجة'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold">
                                                    {new Date(expense.createdAt).toLocaleDateString('ar-SA', { month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black tabular-nums tracking-tight text-slate-900">
                                            -{expense.amount.toLocaleString()} <span className="text-[10px] font-bold text-slate-400 ml-1">{expense.currency}</span>
                                        </div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">عملية ناجحة</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
