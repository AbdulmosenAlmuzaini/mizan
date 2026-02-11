import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield, Globe, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [lang, setLang] = useState<'ar' | 'en'>('ar');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login({ email, password });
            login(response.token, response.user);
            navigate('/');
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || (lang === 'ar' ? 'فشل تسجيل الدخول. تحقق من بياناتك.' : 'Login failed. Check your credentials.');
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
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-200/50 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-200/50 blur-[120px] rounded-full"
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

            {/* Login Card Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[480px] z-10"
            >
                <div className="bg-white border border-slate-100 rounded-[40px] p-12 relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

                    {/* Logo & Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-50 mb-8 border border-primary-100 shadow-sm"
                        >
                            <Shield size={40} className="text-primary-600" />
                        </motion.div>
                        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                            {lang === 'ar' ? 'ميزان' : 'MIZAN'}
                        </h1>
                        <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase">
                            {lang === 'ar' ? 'إدارة الموارد المالية بذكاء' : 'Smart Finance Management'}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">
                                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                            </label>
                            <div className="relative group">
                                <Mail size={18} className={cn(
                                    "absolute right-5 top-1/2 -translate-y-1/2 transition-colors",
                                    focusedField === 'email' ? "text-primary-600" : "text-slate-300"
                                )} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pr-14 pl-6 py-4.5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all shadow-sm focus:shadow-md"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">
                                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                            </label>
                            <div className="relative group">
                                <Lock size={18} className={cn(
                                    "absolute right-5 top-1/2 -translate-y-1/2 transition-colors",
                                    focusedField === 'password' ? "text-primary-600" : "text-slate-300"
                                )} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pr-14 pl-6 py-4.5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all shadow-sm focus:shadow-md"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-3"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-500 py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary-600/20 transition-all active-scale disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 font-bold text-sm">
                            {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-primary-600 hover:text-primary-500 font-black transition-colors"
                            >
                                {lang === 'ar' ? 'سجل الآن' : 'Create an account'}
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


export default Login;
