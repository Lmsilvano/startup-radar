'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
    const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);

    return (
        <ToastContext.Provider value={{ success, error }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
                <AnimatePresence mode="multiple">
                    {toasts.map((toast) => (
                        <ToastComponent
                            key={toast.id}
                            toast={toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastComponent({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const isSuccess = toast.type === 'success';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
                "pointer-events-auto relative group flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all",
                isSuccess 
                    ? "bg-primary/10 border-primary/20 text-primary" 
                    : "bg-destructive/10 border-destructive/20 text-destructive"
            )}
        >
            <div className={cn(
                "mt-0.5 p-1 rounded-lg shrink-0",
                isSuccess ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
            )}>
                {isSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            
            <div className="flex-1 pt-0.5">
                <p className="text-sm font-bold tracking-tight leading-snug">
                    {isSuccess ? "Sucesso" : "Ocorreu um erro"}
                </p>
                <p className={cn(
                    "text-xs mt-0.5 font-medium leading-relaxed",
                    isSuccess ? "text-primary/80" : "text-destructive/80"
                )}>
                    {toast.message}
                </p>
            </div>

            <button
                onClick={onClose}
                className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5"
            >
                <X size={14} className="opacity-50" />
            </button>

            {/* Subtle progress bar */}
            <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className={cn(
                    "absolute bottom-0 left-0 h-0.5 rounded-full",
                    isSuccess ? "bg-primary/30" : "bg-destructive/30"
                )}
            />
        </motion.div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
