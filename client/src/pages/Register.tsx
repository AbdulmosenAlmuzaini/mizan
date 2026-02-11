import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Building, ArrowRight, Shield, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Register: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        companyName: ''
    });
    const [lang, setLang] = useState<'ar' | 'en'>('ar');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 2) {
            setStep(2);
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authAPI.register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || (lang === 'ar' ? 'فشل التسجيل. حاول مرة أخرى.' : 'Registration failed. Try again.');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#f8fafc] overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 opacity-40">
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-200/50 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 18, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-200/50 blur-[120px] rounded-full"
                />
            </div>

            {/* Language Toggle */}
            <div className="absolute top-10 right-10 z-20">
                <button
                    onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 transition-all active-scale flex items-center gap-2 shadow-sm"
                >
                    <Globe size={16} />
                    {lang === 'ar' ? 'English' : 'عربي'}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[540px] z-10"
            >
                <div className="bg-white border border-slate-100 rounded-[40px] p-12 relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-3 mb-12">
                        <div className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-500",
                            step >= 1 ? "bg-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]" : "bg-slate-100"
                        )} />
                        <div className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-500",
                            step >= 2 ? "bg-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]" : "bg-slate-100"
                        )} />
                    </div>

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100 shadow-sm">
                                <Shield className="text-primary-600" size={24} />
                            </div>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">MIZAN</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3">
                            {lang === 'ar' ? 'إنشاء حساب جديد' : 'Join Mizan Finance'}
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            {lang === 'ar' ? 'ابدأ بإدارة شؤونك المالية بذكاء وسرعة' : 'Start managing your finances smartly and efficiently'}
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-2 gap-4 text-right">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">
                                                {lang === 'ar' ? 'الاسم الأول' : 'First Name'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all shadow-sm"
                                                placeholder={lang === 'ar' ? 'أحمد' : 'John'}
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">
                                                {lang === 'ar' ? 'اسم العائلة' : 'Last Name'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all shadow-sm"
                                                placeholder={lang === 'ar' ? 'محمد' : 'Doe'}
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-right">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">
                                            {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                                        </label>
                                        <div className="relative group">
                                            <Mail size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary-600" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pr-14 pl-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all shadow-sm text-left rtl:text-right"
                                                placeholder="name@company.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-right">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">
                                            {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                                        </label>
                                        <div className="relative group">
                                            <Lock size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary-600" />
                                            <input
                                                type="password"
                                                required
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pr-14 pl-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all shadow-sm"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2 text-right">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">
                                            {lang === 'ar' ? 'اسم الشركة' : 'Company Name'}
                                        </label>
                                        <div className="relative group">
                                            <Building size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary-600" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pr-14 pl-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all shadow-sm"
                                                placeholder={lang === 'ar' ? 'شركة ميزان للتجارة' : 'Mizan Trading Co.'}
                                                value={formData.companyName}
                                                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 text-center px-4 font-bold leading-relaxed">
                                        {lang === 'ar'
                                            ? 'بالنقر على "إنشاء الحساب"، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.'
                                            : 'By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.'}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-3">
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold flex items-center gap-3">
                                <CheckCircle size={18} />
                                {lang === 'ar' ? 'تم إنشاء الحساب بنجاح! جارٍ التحويل...' : 'Account created! Redirecting...'}
                            </motion.div>
                        )}

                        <div className="flex gap-4 pt-4">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                    className="w-1/3 border border-slate-100 hover:bg-slate-50 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 transition-all active-scale disabled:opacity-50 shadow-sm"
                                >
                                    {lang === 'ar' ? 'رجوع' : 'Back'}
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary-600 hover:bg-primary-500 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary-600/20 transition-all active-scale group disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <span>{step === 1 ? (lang === 'ar' ? 'المتابعة' : 'Next Step') : (lang === 'ar' ? 'إنشاء الحساب' : 'Create Account')}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-bold text-sm">
                            {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                            <button onClick={() => navigate('/login')} className="text-primary-600 hover:text-primary-500 font-black transition-colors">
                                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer Copyright */}
                <p className="mt-8 text-center text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase">
                    © 2026 MIZAN FINANCE. ALL RIGHTS RESERVED.
                </p>
            </motion.div>
        </div>
    );
};


export default Register;
