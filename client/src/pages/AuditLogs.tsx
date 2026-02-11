import React, { useState } from 'react';
import {
    Search,
    Filter,
    Clock,
    User as UserIcon,
    Activity,
    ArrowRightLeft,
    ChevronRight,
    ChevronLeft,
    Server,
    ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LogEntry {
    id: string;
    action: string;
    details: string;
    user: string;
    timestamp: string;
    type: 'auth' | 'transaction' | 'budget' | 'system';
}

const mockLogs: LogEntry[] = [
    { id: '1', action: 'LOGIN', details: 'تم تسجيل دخول المستخدم من 192.168.1.1', user: 'محمد أحمد', timestamp: '2026-02-09 09:12:45', type: 'auth' },
    { id: '2', action: 'CREATE_EXPENSE', details: 'إضافة مصروف جديد: 500 ريال (تسويق)', user: 'سارة خالد', timestamp: '2026-02-09 09:05:12', type: 'transaction' },
    { id: '3', action: 'UPDATE_BUDGET', details: 'زيادة ميزانية التسويق بمقدار 10,000 ريال', user: 'محمد أحمد', timestamp: '2026-02-09 08:50:00', type: 'budget' },
    { id: '4', action: 'CREATE_CARD', details: 'إصدار بطاقة افتراضية لسارة خالد', user: 'محمد أحمد', timestamp: '2026-02-09 08:32:15', type: 'system' },
    { id: '5', action: 'LOGIN', details: 'تم تسجيل دخول المستخدم من 10.0.0.12', user: 'أحمد علي', timestamp: '2026-02-09 08:15:22', type: 'auth' },
];

const AuditLogs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight flex items-center gap-4">
                        سجل العمليات
                    </h1>
                    <p className="text-slate-500 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        سجلات الأمان الموحدة ومراقبة نشاط المنصة
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="بحث في السجلات..."
                            className="bg-white border border-slate-100 rounded-2xl pr-12 pl-6 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500/50 focus:bg-slate-50 transition-all w-full md:w-80 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'العمليات اليومية', value: '428', icon: ArrowRightLeft, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'تنبيهات الأمان', value: '12', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'استهلاك النظام', value: '1.2 GB', icon: Server, color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white rounded-[32px] p-8 border border-slate-100 group hover:shadow-lg hover:-translate-y-1 transition-all cursor-default shadow-sm"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">في الوقت الفعلي</span>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tabular-nums">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <Filter className="text-primary-600" size={18} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">تدفق النشاط</h3>
                    </div>
                    <div className="flex gap-2">
                        {['الكل', 'الأمان', 'العمليات', 'النظام'].map(f => (
                            <button key={f} className="px-5 py-2 rounded-xl text-[10px] font-black bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all active-scale">
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto text-right">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">المستخدم</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع العمل</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">التفاصيل</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">الطابع الزمني</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockLogs.map((log, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={log.id}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                                                <UserIcon size={18} />
                                            </div>
                                            <span className="font-black text-sm text-slate-900">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg text-[9px] font-black text-primary-600 uppercase tracking-widest inline-flex items-center gap-2">
                                            <Activity size={12} />
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-slate-600 font-bold text-sm">
                                        {log.details}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
                                            <Clock size={14} className="text-slate-300" />
                                            {log.timestamp}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-slate-50/30 px-8 py-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        عرض <span className="text-slate-900">1-5</span> من <span className="text-slate-900">1,245</span> سجل
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all active-scale">
                            <ChevronRight size={18} />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all active-scale">
                            <ChevronLeft size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AuditLogs;
