import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, Target, Zap } from 'lucide-react';

const Budget: React.FC = () => {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight flex items-center gap-4">
                        الميزانية الذكية
                    </h1>
                    <p className="text-slate-500 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        التخطيط المالي وإدارة الحدود المدعومة بالذكاء الاصطناعي
                    </p>
                </div>

                <button className="bg-primary-600 hover:bg-primary-500 px-8 py-3.5 rounded-2xl text-[10px] font-black text-white shadow-lg shadow-primary-600/10 transition-all active-scale flex items-center gap-3 group uppercase tracking-widest">
                    <TrendingUp size={18} />
                    <span>إنشاء هدف ميزانية جديد</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'سرعة الإنفاق', value: 'مرتفع', icon: Zap, color: 'from-amber-500 to-orange-600', textColor: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'هدف الادخار', value: '76%', icon: Target, color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'صحة الميزانية', value: 'ممتاز', icon: TrendingUp, color: 'from-primary-500 to-indigo-600', textColor: 'text-primary-600', bg: 'bg-primary-50' },
                ].map((item, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={item.label}
                        className="bg-white rounded-[32px] p-8 group relative overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <div className="relative z-10 text-right">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 bg-gradient-to-br shadow-lg", item.color)}>
                                <item.icon size={28} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <h3 className="text-3xl font-black text-slate-900">{item.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center space-y-6 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto relative">
                    <PieChart className="text-slate-300" size={48} />
                    <div className="absolute inset-0 border-2 border-primary-500/10 border-t-primary-500 rounded-full animate-spin-slow" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">تحليل الميزانية بالذكاء الاصطناعي قيد المعالجة</p>
                <p className="max-w-md mx-auto text-slate-500 font-bold text-sm leading-relaxed">
                    نحن نقوم بتحليل أنماط الإنفاق الخاصة بك لإنشاء توصيات ميزانية مخصصة لك.
                </p>
            </div>
        </div>
    );
};

// Helper inside the file to keep it self-contained for now
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default Budget;
