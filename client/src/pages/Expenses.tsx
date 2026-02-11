import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    X,
    Edit2,
    Trash2,
    Filter,
    Loader2,
    AlertCircle,
    CheckCircle,
    DollarSign,
    File,
    Paperclip,
    ExternalLink
} from 'lucide-react';
import { expenseAPI, type Expense, type CreateExpenseRequest, type UpdateExpenseRequest } from '../services/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Expenses: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [formData, setFormData] = useState<CreateExpenseRequest>({
        amount: 0,
        currency: 'SAR',
        description: '',
        category: '',
        receiptUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const data = await expenseAPI.getAll();
            setExpenses(data || []);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'فشل في تحميل المصاريف');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setModalMode('create');
        setFormData({ amount: 0, currency: 'SAR', description: '', category: '', receiptUrl: '' });
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleEdit = (expense: Expense) => {
        setModalMode('edit');
        setSelectedExpense(expense);
        setFormData({
            amount: expense.amount,
            currency: expense.currency,
            description: expense.description || '',
            category: expense.category,
            receiptUrl: expense.receiptUrl || ''
        });
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const dataToSend = new FormData();
            dataToSend.append('amount', formData.amount.toString());
            dataToSend.append('currency', formData.currency || 'SAR');
            dataToSend.append('description', formData.description || '');
            dataToSend.append('category', formData.category);

            if (selectedFile) {
                dataToSend.append('receipt', selectedFile);
            } else if (formData.receiptUrl) {
                dataToSend.append('receiptUrl', formData.receiptUrl);
            }

            if (modalMode === 'create') {
                await expenseAPI.create(dataToSend);
            } else if (selectedExpense) {
                await expenseAPI.update(selectedExpense.id, dataToSend);
            }
            await fetchExpenses();
            setShowModal(false);
        } catch (err: any) {
            alert(err.response?.data?.error || 'فشلت العملية');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه العملية؟')) return;

        try {
            await expenseAPI.delete(id);
            await fetchExpenses();
        } catch (err: any) {
            alert(err.response?.data?.error || 'فشل المسح');
        }
    };

    const filteredExpenses = expenses.filter(exp =>
        statusFilter === 'ALL' || exp.status === statusFilter
    );

    const getStatusAr = (status: string) => {
        switch (status) {
            case 'PENDING': return 'قيد الانتظار';
            case 'APPROVED': return 'مقبول';
            case 'REJECTED': return 'مرفوض';
            case 'COMPLETED': return 'مكتمل';
            default: return status;
        }
    };

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                        المصاريف
                    </h1>
                    <p className="text-slate-500 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        إدارة وتتبع العمليات المالية والمصاريف الخاصة بالشركة
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-primary-600 hover:bg-primary-500 px-8 py-3.5 rounded-2xl text-[10px] font-black text-white shadow-lg shadow-primary-600/10 transition-all active-scale flex items-center gap-3 group uppercase tracking-widest"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>إضافة مصروف جديد</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-[32px] p-4 border border-slate-100 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="flex items-center gap-3 px-4 py-2 border-l border-slate-100">
                    <Filter size={18} className="text-primary-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">تصفية حسب الحالة:</span>
                </div>
                <div className="flex gap-2">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-[10px] font-black transition-all active-scale",
                                statusFilter === status
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/10"
                                    : "bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            )}
                        >
                            {status === 'ALL' ? 'الكل' : getStatusAr(status)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Area */}
            {loading ? (
                <div className="bg-white rounded-[32px] border border-slate-100 p-20 flex items-center justify-center shadow-sm">
                    <Loader2 className="animate-spin text-primary-600" size={32} />
                </div>
            ) : error ? (
                <div className="bg-white rounded-[32px] p-8 border-2 border-rose-100 bg-rose-50 text-rose-600 flex items-center gap-4 font-bold shadow-sm">
                    <AlertCircle size={24} />
                    <span>{error}</span>
                </div>
            ) : filteredExpenses.length === 0 ? (
                <div className="bg-white rounded-[32px] border border-slate-100 p-20 text-center space-y-4 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <DollarSign className="text-slate-300" size={40} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">لا يوجد عمليات لعرضها</p>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">التاريخ</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">الفئة</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">المرفقات</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">الوصف</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredExpenses.map((expense, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={expense.id}
                                        className="hover:bg-slate-50 transition-colors group"
                                    >
                                        <td className="px-8 py-6 text-sm font-bold text-slate-500 tabular-nums">
                                            {new Date(expense.createdAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {expense.receiptUrl ? (
                                                <a
                                                    href={`${import.meta.env.VITE_API_BASE_URL || ''}${expense.receiptUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 flex items-center justify-center bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                                                >
                                                    <Paperclip size={14} />
                                                </a>
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-900 max-w-xs truncate">
                                            {expense.description || '—'}
                                        </td>
                                        <td className="px-8 py-6 text-lg font-black text-slate-900 tabular-nums tracking-tight">
                                            {expense.amount.toLocaleString()} <span className="text-[10px] font-bold text-slate-400 ml-1">{expense.currency}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border",
                                                expense.status === 'COMPLETED' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                                                    expense.status === 'APPROVED' ? "bg-blue-50 border-blue-100 text-blue-600" :
                                                        expense.status === 'REJECTED' ? "bg-rose-50 border-rose-100 text-rose-600" :
                                                            "bg-amber-50 border-amber-100 text-amber-600"
                                            )}>
                                                {getStatusAr(expense.status)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-primary-50 rounded-xl transition-all text-slate-600 hover:text-primary-600 active-scale"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-rose-50 rounded-xl transition-all text-slate-600 hover:text-rose-600 active-scale"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Premium Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-xl bg-white rounded-[40px] p-8 sm:p-12 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                                        {modalMode === 'create' ? 'إضافة عملية جديدة' : 'تحديث العملية'}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">يرجى إدخال تفاصيل العملية أدناه</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-11 h-11 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active-scale">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-4">المبلغ</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all tabular-nums text-lg font-black"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-4">العملة</label>
                                        <select
                                            value={formData.currency}
                                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all font-black"
                                        >
                                            <option value="SAR">ريال سعودي — SAR</option>
                                            <option value="USD">دولار أمريكي — USD</option>
                                            <option value="EUR">يورو — EUR</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-4">الفئة</label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all font-bold"
                                    >
                                        <option value="">اختر الفئة...</option>
                                        <option value="Travel">سفر وتنقالات</option>
                                        <option value="Equipment">معدات وأدوات</option>
                                        <option value="Office">لوازم مكتبية</option>
                                        <option value="Marketing">تسويق وإعلان</option>
                                        <option value="Salaries">رواتب وأجور</option>
                                        <option value="Other">أخرى</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-4">الوصف (اختياري)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500/50 focus:bg-white transition-all font-bold"
                                        rows={2}
                                        placeholder="أضف تفاصيل إضافية هنا..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-4">المرفقات (صور أو PDF)</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            id="receipt-upload"
                                            accept=".pdf,image/*"
                                            onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="receipt-upload"
                                            className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 hover:border-primary-500/30 hover:bg-white rounded-2xl px-6 py-4 cursor-pointer transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                                                    <Paperclip size={18} />
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-slate-600 group-hover:text-primary-600 transition-colors">
                                                        {selectedFile ? selectedFile.name : (formData.receiptUrl ? 'تم إرفاق ملف مسبقاً' : 'اختر ملفاً...')}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-slate-400">الحد الأقصى: 10 ميجابايت</p>
                                                </div>
                                            </div>
                                            {selectedFile && (
                                                <CheckCircle size={18} className="text-emerald-500" />
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-slate-50 hover:bg-slate-100 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 transition-all active-scale"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] bg-primary-600 hover:bg-primary-500 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-600/10 transition-all active-scale disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <CheckCircle size={18} />
                                                <span>{modalMode === 'create' ? 'إضافة العملية' : 'حفظ التغييرات'}</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default Expenses;
