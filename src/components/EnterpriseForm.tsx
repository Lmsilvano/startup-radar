import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enterpriseSchema, Enterprise, Segment } from "@/types/enterprise";
import { X, Save, AlertCircle, Info, MapPin } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SC_CITIES } from "@/data/sc-cities";

interface EnterpriseFormProps {
    initialData?: Enterprise | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Enterprise) => void;
    isSubmitting: boolean;
}

export function EnterpriseForm({ initialData, isOpen, onClose, onSubmit, isSubmitting }: EnterpriseFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm<Enterprise>({
        resolver: zodResolver(enterpriseSchema),
        defaultValues: initialData || {
            isActive: true,
            segment: Segment.TECHNOLOGY,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                isActive: true,
                segment: Segment.TECHNOLOGY,
                name: "",
                entrepreneur: "",
                city: "",
                contact: "",
            });
        }
    }, [initialData, reset, isOpen]);

    const { field: foundationDateField } = useController({ name: "foundationDate", control });

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const cityValue = watch("city");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue("city", value, { shouldValidate: true });

        if (value.length > 1) {
            const filtered = SC_CITIES.filter(city =>
                city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
                    value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                )
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
            setSelectedIndex(-1);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectCity = (city: string) => {
        setValue("city", city, { shouldValidate: true });
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            selectCity(suggestions[selectedIndex]);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

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
                        className="relative w-full max-w-2xl bg-card rounded-2xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">
                                    {initialData ? "Editar Registro" : "Novo Cadastro"}
                                </h2>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Preencha as informações para atualizar o radar de inovação.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-background transition-colors active:scale-95"
                            >
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 overflow-y-auto space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                <FormField label="Nome do Empreendimento" error={errors.name?.message}>
                                    <input
                                        {...register("name")}
                                        className={cn(formInputClass, errors.name && "border-destructive focus:ring-destructive/10")}
                                        placeholder="Ex: Startup SC"
                                    />
                                </FormField>

                                <FormField label="Empreendedor Responsável" error={errors.entrepreneur?.message}>
                                    <input
                                        {...register("entrepreneur")}
                                        className={cn(formInputClass, errors.entrepreneur && "border-destructive focus:ring-destructive/10")}
                                        placeholder="Ex: João Silva"
                                    />
                                </FormField>

                                <FormField label="Cidade (Santa Catarina)" error={errors.city?.message}>
                                    <div className="relative" ref={containerRef}>
                                        <div className="relative">
                                            <input
                                                value={cityValue || ""}
                                                onChange={handleCityChange}
                                                onKeyDown={handleKeyDown}
                                                onFocus={() => {
                                                    if (cityValue?.length > 1 && suggestions.length > 0) setShowSuggestions(true);
                                                }}
                                                className={cn(formInputClass, "pl-10", errors.city && "border-destructive focus:ring-destructive/10")}
                                                placeholder="Ex: Florianópolis"
                                                autoComplete="off"
                                            />
                                            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                        </div>

                                        <AnimatePresence>
                                            {showSuggestions && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute z-50 w-full mt-2 bg-card border rounded-xl shadow-xl overflow-hidden"
                                                >
                                                    <div className="p-1">
                                                        {suggestions.map((city, index) => (
                                                            <button
                                                                key={city}
                                                                type="button"
                                                                onClick={() => selectCity(city)}
                                                                onMouseEnter={() => setSelectedIndex(index)}
                                                                className={cn(
                                                                    "w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-3",
                                                                    index === selectedIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold",
                                                                    index === selectedIndex ? "bg-primary-foreground/20 text-white" : "bg-muted text-muted-foreground"
                                                                )}>
                                                                    SC
                                                                </div>
                                                                <span className="font-medium">{city}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="bg-muted/50 px-3 py-2 border-t flex items-center justify-between">
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Cidades de Santa Catarina</span>
                                                        <div className="flex gap-1">
                                                            <div className="px-1 py-0.5 rounded border bg-background text-[8px] font-bold shadow-sm inline-flex items-center justify-center min-w-[14px]">
                                                                ↓
                                                            </div>
                                                            <div className="px-1 py-0.5 rounded border bg-background text-[8px] font-bold shadow-sm inline-flex items-center justify-center min-w-[14px]">
                                                                ↑
                                                            </div>
                                                            <div className="px-1 py-0.5 rounded border bg-background text-[8px] font-bold shadow-sm inline-flex items-center justify-center">
                                                                ENTER
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </FormField>

                                <FormField label="Segmento de Atuação" error={errors.segment?.message}>
                                    <select
                                        {...register("segment")}
                                        className={cn(formInputClass, "cursor-pointer appearance-none")}
                                    >
                                        {Object.values(Segment).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Meio de Contato" error={errors.contact?.message}>
                                    <input
                                        {...register("contact")}
                                        className={cn(formInputClass, errors.contact && "border-destructive focus:ring-destructive/10")}
                                        placeholder="contato@empresa.com"
                                    />
                                </FormField>

                                <div className="flex flex-col justify-center gap-3 pt-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status do Registro</label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                {...register("isActive")}
                                                className="peer w-6 h-6 rounded-lg border bg-background appearance-none checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                            />
                                            <svg className="absolute w-4 h-4 text-primary-foreground left-1 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium group-hover:text-primary transition-colors">Ativo no Radar</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 border-t space-y-6">
                                <div className="flex items-center gap-2 text-primary">
                                    <Info size={14} />
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Informações Opcionais</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField label="Website" error={errors.website?.message}>
                                        <input {...register("website")} className={formInputClass} placeholder="https://..." />
                                    </FormField>
                                    <FormField label="Data de Fundação">
                                        <DatePicker
                                            value={foundationDateField.value}
                                            onChange={foundationDateField.onChange}
                                            placeholder="DD/MM/AAAA"
                                        />
                                    </FormField>
                                </div>
                                <FormField label="Descrição do Negócio">
                                    <textarea
                                        {...register("description")}
                                        className={cn(formInputClass, "min-h-[100px] resize-none")}
                                        placeholder="Conte um pouco sobre o negócio..."
                                    />
                                </FormField>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 h-12 rounded-xl border font-semibold text-sm hover:bg-muted transition-all active:scale-95"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-10 h-12 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                                >
                                    {isSubmitting ? "Processando..." : "Salvar Registro"}
                                    {!isSubmitting && <Save size={18} />}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function FormField({ label, children, error }: { label: string, children: React.ReactNode, error?: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                </label>
                {error && (
                    <span className="text-[10px] font-bold text-destructive flex items-center gap-1 animate-in slide-in-from-right-2">
                        <AlertCircle size={10} /> {error}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

const formInputClass = "w-full bg-background border rounded-xl p-3.5 text-sm font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm";
