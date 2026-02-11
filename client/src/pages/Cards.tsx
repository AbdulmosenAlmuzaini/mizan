import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, ArrowUpRight, ShieldCheck } from 'lucide-react';

const Cards: React.FC = () => {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black premium-text mb-3 tracking-tight uppercase flex items-center gap-4">
                        <CreditCard className="text-primary-500" size={36} />
                        My Cards
                    </h1>
                    <p className="text-slate-500 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        Manage your physical and virtual payment methods
                    </p>
                </div>

                <button className="bg-primary-600 hover:bg-primary-500 px-8 py-3.5 rounded-2xl text-xs font-black text-white shadow-lg shadow-primary-600/20 transition-all active-scale flex items-center gap-3 group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>ISSUE NEW CARD</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Card Example */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="aspect-[1.586/1] w-full max-w-lg relative group perspective-1000"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-indigo-600 to-purple-700 rounded-[32px] shadow-2xl shadow-primary-500/20 overflow-hidden transform group-hover:rotate-y-12 transition-transform duration-700">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <div className="absolute top-8 right-8 text-white/40 font-black italic tracking-widest">VISA</div>
                        <div className="absolute top-12 left-8 w-12 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-inner" />

                        <div className="absolute bottom-20 left-8 space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Card Number</p>
                            <p className="text-2xl font-mono text-white tracking-[0.2em]">**** **** **** 8842</p>
                        </div>

                        <div className="absolute bottom-8 left-8 flex gap-12">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Card Holder</p>
                                <p className="text-xs font-black text-white uppercase tracking-widest">Khalid Al-Mansour</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Expires</p>
                                <p className="text-xs font-black text-white uppercase tracking-widest">08/29</p>
                            </div>
                        </div>
                    </div>

                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-[32px]" />
                </motion.div>

                {/* Card Stats */}
                <div className="space-y-6">
                    <div className="glass-card rounded-[32px] p-8 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <ArrowUpRight size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Spent (MTD)</p>
                                <h3 className="text-2xl font-black text-slate-100 tabular-nums">14,280.00 <span className="text-xs text-slate-500">SAR</span></h3>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-[32px] p-8 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Limit</p>
                                <h3 className="text-2xl font-black text-slate-100 tabular-nums">50,000.00 <span className="text-xs text-slate-500">SAR</span></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cards;
