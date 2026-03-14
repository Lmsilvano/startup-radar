import { Trash2, AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "warning" | "info";
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "destructive",
    isLoading = false,
}: ConfirmModalProps) {
    const variantStyles = {
        destructive: {
            icon: <Trash2 className="w-6 h-6 text-destructive" />,
            iconBg: "bg-destructive/10",
            button: "bg-destructive text-destructive-foreground shadow-destructive/20 hover:bg-destructive/90",
            border: "border-destructive/20",
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-warning" />,
            iconBg: "bg-warning/10",
            button: "bg-warning text-warning-foreground shadow-warning/20 hover:bg-warning/90",
            border: "border-warning/20",
        },
        info: {
            icon: <AlertTriangle className="w-6 h-6 text-primary" />,
            iconBg: "bg-primary/10",
            button: "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90",
            border: "border-primary/20",
        },
    };

    const style = variantStyles[variant];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={false}
            className="max-w-md"
        >
            <div className="flex flex-col items-center text-center gap-6">
                <div className={`p-4 rounded-2xl ${style.iconBg} ${style.border} border shadow-inner`}>
                    {style.icon}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full pt-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 h-12 rounded-xl border font-semibold text-sm hover:bg-muted transition-all active:scale-95 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-6 h-12 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 ${style.button}`}
                    >
                        {isLoading ? "Processando..." : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
