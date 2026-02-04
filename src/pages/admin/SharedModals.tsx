import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-card w-full max-w-md overflow-hidden shadow-2xl"
            >
                <div className="p-10 text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${isDangerous ? 'bg-red-50 text-red-500' : 'bg-[#BA9B32]/10 text-[#BA9B32]'}`}>
                        {isDangerous ? <AlertCircle size={40} /> : <CheckCircle size={40} />}
                    </div>
                    <h3 className="text-2xl font-display mb-4">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-10">{message}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-navy-deep transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 py-4 rounded-full font-bold text-[10px] uppercase tracking-[.3em] transition-all shadow-xl ${isDangerous ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' : 'bg-navy-deep text-white hover:bg-[#BA9B32] shadow-navy-deep/20'}`}
                        >
                            {isLoading ? 'Processing...' : confirmText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
