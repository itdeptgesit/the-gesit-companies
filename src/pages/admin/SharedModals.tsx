import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Execute Action",
    cancelText = "Abort",
    isDangerous = false,
    isLoading = false
}: {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    title: string,
    message: string,
    confirmText?: string,
    cancelText?: string,
    isDangerous?: boolean,
    isLoading?: boolean
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-navy-deep/20 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 relative"
            >
                <div className="p-8 text-center relative z-10">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all ${isDangerous ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-navy-deep text-white shadow-navy-deep/20'}`}>
                        {isDangerous ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
                    </div>

                    <h3 className="text-xl font-black text-navy-deep mb-2 tracking-tight">{title}</h3>
                    <p className="text-slate-400 text-[10px] leading-relaxed mb-8 font-black uppercase tracking-widest">{message}</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 ${isDangerous ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95' : 'bg-navy-deep text-white hover:bg-amber-500 active:scale-95'}`}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-navy-deep transition-all"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
