import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem
                            key={toast.id}
                            toast={toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem: React.FC<{ toast: Toast, onClose: () => void }> = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle className="text-emerald-500" size={18} />,
        error: <XCircle className="text-red-500" size={18} />,
        warning: <AlertCircle className="text-amber-500" size={18} />,
        info: <Info className="text-blue-500" size={18} />,
    };

    const colors = {
        success: 'border-emerald-500/20 bg-emerald-50/90',
        error: 'border-red-500/20 bg-red-50/90',
        warning: 'border-amber-500/20 bg-amber-50/90',
        info: 'border-blue-500/20 bg-blue-50/90',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 ${colors[toast.type]}`}
        >
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    {icons[toast.type]}
                </div>
                <p className="text-[13px] font-bold text-navy-deep leading-tight">
                    {toast.message}
                </p>
            </div>
            <button
                onClick={onClose}
                className="text-slate-400 hover:text-navy-deep transition-colors p-1"
            >
                <X size={14} />
            </button>

            {/* Progress bar */}
            <motion.div
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 rounded-full opacity-30 ${toast.type === 'success' ? 'bg-emerald-500' :
                    toast.type === 'error' ? 'bg-red-500' :
                        toast.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
            />
        </motion.div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
