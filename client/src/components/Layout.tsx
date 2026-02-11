import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Bell,
  Globe,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useAuth } from '../context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lang, setLang] = useState<'ar' | 'en'>('ar'); // Default to Arabic as requested
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const navItems = [
    { name: lang === 'ar' ? 'الرئيسية' : 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: lang === 'ar' ? 'المصاريف' : 'Expenses', icon: Receipt, path: '/expenses' },
    { name: lang === 'ar' ? 'الميزانية' : 'Budget', icon: PieChart, path: '/budget' },
    { name: lang === 'ar' ? 'سجل العمليات' : 'Audit Logs', icon: ShieldCheck, path: '/audit-logs' },
    { name: lang === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen text-slate-900 flex relative overflow-hidden bg-white font-outfit">
      {/* Dynamic Background Elements (Subtle for Light Mode) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-100/30 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50/30 blur-[150px] rounded-full" />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 90 }}
        className={cn(
          "fixed inset-y-0 z-50 bg-white border-slate-100 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[20px_0_40px_rgba(0,0,0,0.02)]",
          lang === 'ar' ? "right-0 border-l" : "left-0 border-r"
        )}
      >
        <div className="h-24 flex items-center justify-between px-8">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-2xl font-black text-slate-900 tracking-[0.2em]"
              >
                MIZAN
              </motion.div>
            ) : (
              <motion.div
                key="logo-short"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-primary-600/20"
              >
                M
              </motion.div>
            )}
          </AnimatePresence>
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-all active-scale text-slate-400 hover:text-slate-600"
            >
              <ChevronLeft className={cn(lang === 'ar' && "rotate-180")} size={20} />
            </button>
          )}
        </div>

        {!isSidebarOpen && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active-scale group"
            >
              <Menu size={20} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
            </button>
          </div>
        )}

        <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group relative active-scale",
                  isActive
                    ? "bg-primary-50 text-primary-700 shadow-[0_4px_15px_rgba(14,165,233,0.1)]"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500",
                  isActive ? "bg-primary-600 text-white shadow-md shadow-primary-600/20" : "bg-slate-50 group-hover:bg-slate-100"
                )}>
                  <item.icon size={18} />
                </div>
                {isSidebarOpen && (
                  <span className="font-bold text-[11px] uppercase tracking-[0.1em] flex-1 text-left">
                    {item.name}
                  </span>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div
                    layoutId="sideIndicator"
                    className="w-1 h-5 bg-primary-500 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-slate-50">
          <button
            onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
            className="w-full flex items-center gap-4 p-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all active-scale"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl">
              <Globe size={18} />
            </div>
            {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-[0.1em] flex-1 text-left">{lang === 'ar' ? 'English' : 'العربية'}</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-2xl text-rose-500/80 hover:bg-rose-50 hover:text-rose-600 transition-all active-scale"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-rose-50 rounded-xl">
              <LogOut size={18} />
            </div>
            {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-[0.1em] flex-1 text-left">{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative z-10 bg-white",
        lang === 'ar' ? (isSidebarOpen ? "mr-[280px]" : "mr-[90px]") : (isSidebarOpen ? "ml-[280px]" : "ml-[90px]")
      )}>
        {/* Top Header */}
        <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {lang === 'ar' ? `مرحباً بك، ${user?.firstName}` : `Welcome back, ${user?.firstName}`}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all active-scale relative group">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white shadow-sm group-hover:scale-125 transition-transform"></span>
            </button>

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                  {user?.role === 'ADMIN' ? 'مسؤول النظام' : 'مستخدم'}
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 group-hover:border-primary-200 transition-all">
                <UserIcon size={20} className="text-slate-600 group-hover:text-primary-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <div className="p-10 max-w-7xl mx-auto pb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};


export default Layout;
