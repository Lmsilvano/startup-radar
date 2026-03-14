import { Segment } from "@/types/enterprise";
import { Search, FilterX, Plus, ChevronDown } from "lucide-react";

interface FilterState {
    search: string;
    segment: string;
    status: string;
    city: string;
}

interface FiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    onAddClick: () => void;
}

export function Filters({ filters, setFilters, onAddClick }: FiltersProps) {
    const handleClear = () => {
        setFilters({ search: "", segment: "", status: "", city: "" });
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou empreendedor..."
                        className="w-full bg-background/50 border rounded-xl p-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleClear}
                        className="px-6 h-[58px] rounded-xl border bg-secondary/50 text-sm font-semibold hover:bg-secondary hover:border-secondary transition-all flex items-center gap-2 group shadow-sm active:scale-95"
                    >
                        <FilterX className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                        <span className="hidden sm:inline">Limpar</span>
                    </button>

                    <button
                        onClick={onAddClick}
                        className="flex-1 lg:flex-none px-8 h-[58px] rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="whitespace-nowrap">Novo Registro</span>
                    </button>
                </div>
            </div>

            {/* Select Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ModernSelect
                    label="Segmento"
                    value={filters.segment}
                    onChange={(val) => setFilters({ ...filters, segment: val })}
                >
                    <option value="">Todos os segmentos</option>
                    {Object.values(Segment).map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </ModernSelect>

                <ModernSelect
                    label="Status"
                    value={filters.status}
                    onChange={(val) => setFilters({ ...filters, status: val })}
                >
                    <option value="">Todos os status</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                </ModernSelect>

                <ModernSelect
                    label="Município"
                    value={filters.city}
                    onChange={(val) => setFilters({ ...filters, city: val })}
                >
                    <option value="">Todos os municípios</option>
                </ModernSelect>
            </div>
        </div>
    );
}

function ModernSelect({ label, value, onChange, children }: {
    label: string,
    value: string,
    onChange: (val: string) => void,
    children: React.ReactNode
}) {
    return (
        <div className="relative group">
            <label className="absolute -top-2 left-3 bg-card px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground z-10 rounded-full border">
                {label}
            </label>
            <div className="relative">
                <select
                    className="w-full bg-background/50 border rounded-xl p-3.5 pl-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer appearance-none transition-all shadow-sm"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {children}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <ChevronDown size={16} />
                </div>
            </div>
        </div>
    );
}
