import { Enterprise, Segment } from "@/types/enterprise";
import { Edit, Trash2, ExternalLink, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnterpriseTableProps {
    enterprises: Enterprise[];
    onEdit: (enterprise: Enterprise) => void;
    onDelete: (id: string) => void;
}

export function EnterpriseTable({ enterprises, onEdit, onDelete }: EnterpriseTableProps) {
    return (
        <div className="w-full bg-card/30 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b">
                        <tr className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                            <th className="p-6">Empreendimento</th>
                            <th className="p-6">Empreendedor</th>
                            <th className="p-6">Município</th>
                            <th className="p-6">Segmento</th>
                            <th className="p-6 text-center">Status</th>
                            <th className="p-6 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {enterprises.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                            <SearchIcon className="w-6 h-6 opacity-20" />
                                        </div>
                                        <p className="text-sm font-medium">Nenhum registro encontrado no radar</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            enterprises.map((enterprise) => (
                                <tr key={enterprise.id} className="hover:bg-accent/30 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-base tracking-tight">{enterprise.name}</span>
                                            {enterprise.website && (
                                                <a
                                                    href={enterprise.website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Globe size={12} className="opacity-50" />
                                                    {new URL(enterprise.website).hostname.replace('www.', '')}
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm font-medium text-foreground/80">{enterprise.entrepreneur}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm text-muted-foreground">{enterprise.city}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-[10px] font-bold uppercase tracking-wider text-secondary-foreground border">
                                            {enterprise.segment}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <StatusBadge isActive={enterprise.isActive} />
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(enterprise)}
                                                className="p-2 rounded-lg border bg-background hover:bg-muted hover:text-primary transition-all shadow-sm active:scale-95"
                                                title="Editar"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => enterprise.id && onDelete(enterprise.id)}
                                                className="p-2 rounded-lg border bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all shadow-sm active:scale-95"
                                                title="Excluir"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm",
            isActive
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-border"
        )}>
            <span className={cn(
                "w-1.5 h-1.5 rounded-full shadow-sm",
                isActive ? "bg-primary animate-pulse shadow-primary" : "bg-muted-foreground"
            )} />
            {isActive ? "Ativo" : "Inativo"}
        </div>
    );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
