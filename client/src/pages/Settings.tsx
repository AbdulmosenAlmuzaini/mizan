import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Bell, Globe, Key } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight flex items-center gap-4">
                    الإعدادات
                </h1>
                <p className="text-slate-500 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    تكوين تفضيلاتك الشخصية وتعديل خيارات المنصة
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar for settings */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { label: 'الملف الشخصي', icon: User, active: true },
                        { label: 'الأمان والحماية', icon: Shield },
                        { label: 'التنبيهات', icon: Bell },
                        { label: 'اللغة والموقع', icon: Globe },
                        { label: 'مفاتيح الربط (API)', icon: Key },
                    ].map(item => (
                        <button
                            key={item.label}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl transition-all group active-scale border",
                                item.active ? "bg-primary-50 text-primary-600 border-primary-100" : "text-slate-500 hover:text-slate-900 border-transparent hover:bg-slate-50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} className={item.active ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"} />
                                <span className="font-black text-[10px] uppercase tracking-widest">{item.label}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content for settings */}
                <div className="lg:col-span-3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[40px] p-10 space-y-10 border border-slate-100 shadow-sm"
                    >
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-6">معلومات الحساب</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">الاسم الكامل</label>
                                    <input readOnly value="خالد المنصور" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-500 cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">البريد الإلكتروني</label>
                                    <input readOnly value="khalid@mizan.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-500 cursor-not-allowed text-left" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-900 mb-1">تسجيل الدخول بخطوتين (2FA)</p>
                                <p className="text-xs text-slate-400 font-bold">المصادقة الثنائية نشطة حالياً على حسابك لزيادة الأمان.</p>
                            </div>
                            <button className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                مفعل
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default Settings;
