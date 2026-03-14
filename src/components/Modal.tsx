import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    description,
    className,
    showCloseButton = true,
}: ModalProps) {
    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
        }
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={cn(
                            "relative w-full max-w-lg bg-card rounded-2xl border shadow-2xl flex flex-col overflow-hidden",
                            className
                        )}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                                <div>
                                    {title && <h2 className="text-xl font-bold tracking-tight">{title}</h2>}
                                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                                </div>
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-background transition-colors active:scale-95"
                                    >
                                        <X size={20} className="text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-8">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
