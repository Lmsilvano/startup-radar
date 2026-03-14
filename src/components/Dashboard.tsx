import { Enterprise, Segment } from "@/types/enterprise";
import { Users, Building2, CheckCircle2, XCircle, TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardProps {
    enterprises: Enterprise[];
    isLoading?: boolean;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function Dashboard({ enterprises, isLoading }: DashboardProps) {
    const total = enterprises.length;
    const activeCount = enterprises.filter((e) => e.isActive).length;
    const inactiveCount = total - activeCount;

    const segmentStats = Object.values(Segment).map((segment) => ({
        name: segment,
        count: enterprises.filter((e) => e.segment === segment).length,
    }));

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-10 p-4 md:p-8"
        >
            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Total de Empreendimentos"
                    value={total}
                    icon={<Building2 className="w-5 h-5" />}
                    description="Mapeados em solo catarinense"
                    trend="+12% este mês"
                    variant="primary"
                />
                <MetricCard
                    title="Operações Ativas"
                    value={activeCount}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    description={`${((activeCount / total) * 100 || 0).toFixed(1)}% de taxa de atividade`}
                    variant="success"
                />
                <MetricCard
                    title="Em espera / Inativos"
                    value={inactiveCount}
                    icon={<XCircle className="w-5 h-5" />}
                    description="Aguardando atualização ou pausa"
                    variant="warning"
                />
            </div>

            {/* Segment Distribution */}
            <motion.div
                variants={item}
                className="rounded-2xl border bg-card/40 backdrop-blur-sm p-8 shadow-sm"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Distribuição por Segmento
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 text-balance">
                            Análise quantitativa de nichos de mercado em destaque no ecossistema regional.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {segmentStats.map((stat) => (
                        <div
                            key={stat.name}
                            className="p-5 rounded-xl border bg-background/50 hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                            <p className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                                {stat.name}
                            </p>
                            <div className="flex items-baseline gap-2 mt-2">
                                <p className="text-3xl font-bold tracking-tight">
                                    {stat.count}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
    trend?: string;
    variant?: 'primary' | 'success' | 'warning';
}

function MetricCard({ title, value, icon, description, trend, variant = 'primary' }: MetricCardProps) {
    const variantStyles = {
        primary: "text-primary bg-primary/10",
        success: "text-lime-500 bg-lime-500/10",
        warning: "text-slate-400 bg-slate-400/10"
    };

    return (
        <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            className="group relative rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
            <div className="flex justify-between items-start">
                <div className={cn("p-2.5 rounded-xl", variantStyles[variant])}>
                    {icon}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                    </div>
                )}
            </div>

            <div className="mt-6">
                <p className="text-sm font-medium text-muted-foreground tracking-tight">
                    {title}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-4xl font-bold tracking-tight">
                        {value}
                    </p>
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed line-clamp-2">
                    {description}
                </p>
            </div>

            {/* Subtle accent line on hover */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-out" />
        </motion.div>
    );
}
