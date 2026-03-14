'use client';

import { useState, useMemo } from 'react';
import {
    useEnterprises,
    useCreateEnterprise,
    useUpdateEnterprise,
    useDeleteEnterprise
} from '@/hooks/useEnterprises';
import { Enterprise } from '@/types/enterprise';
import { Dashboard } from '@/components/Dashboard';
import { Filters } from '@/components/Filters';
import { EnterpriseTable } from '@/components/EnterpriseTable';
import { EnterpriseForm } from '@/components/EnterpriseForm';
import { motion } from 'framer-motion';

export default function Home() {
    // Data State
    const { data: enterprises = [], isLoading } = useEnterprises();
    const createMutation = useCreateEnterprise();
    const updateMutation = useUpdateEnterprise();
    const deleteMutation = useDeleteEnterprise();

    // UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEnterprise, setEditingEnterprise] = useState<Enterprise | null>(null);

    const [filters, setFilters] = useState({
        search: '',
        segment: '',
        status: '',
        city: '',
    });

    // Filtering Logic
    const filteredEnterprises = useMemo(() => {
        return enterprises.filter((e) => {
            const matchesSearch =
                e.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                e.entrepreneur.toLowerCase().includes(filters.search.toLowerCase());

            const matchesSegment = !filters.segment || e.segment === filters.segment;

            const matchesStatus =
                !filters.status ||
                (filters.status === 'active' ? e.isActive : !e.isActive);

            const matchesCity = !filters.city || e.city === filters.city;

            return matchesSearch && matchesSegment && matchesStatus && matchesCity;
        });
    }, [enterprises, filters]);

    // Handlers
    const handleOpenCreate = () => {
        setEditingEnterprise(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (enterprise: Enterprise) => {
        setEditingEnterprise(enterprise);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Deseja realmente remover este empreendimento do radar?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleFormSubmit = (data: Enterprise) => {
        if (editingEnterprise?.id) {
            updateMutation.mutate(
                { id: editingEnterprise.id, data },
                { onSuccess: () => setIsFormOpen(false) }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => setIsFormOpen(false)
            });
        }
    };

    return (
        <div className="container mx-auto pb-32 space-y-20 antialiased">
            {/* Header Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="px-4 md:px-8 mt-16 md:mt-24 text-center md:text-left"
            >
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Sistema ao Vivo</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                        SC Startup <span className="text-primary italic">Radar</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Santa Catarina Innovation Index. Visão analítica e em tempo real dos empreendimentos mapeados no estado.
                    </p>
                </div>
            </motion.section>

            {/* Content Sections with subtle staggering */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-24"
            >
                {/* Dashboard Section */}
                <section id="dashboard" className="scroll-mt-24">
                    <Dashboard enterprises={enterprises} isLoading={isLoading} />
                </section>

                {/* Listing Section */}
                <section id="listing" className="space-y-10 px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tighter">
                                Diretório de <span className="text-primary">Inovação</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                Base de dados completa filtrada por segmento, cidade e status operacional.
                            </p>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-muted/50 border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {filteredEnterprises.length} DE {enterprises.length} REGISTROS ENCONTRADOS
                        </div>
                    </div>

                    <div className="bg-card/30 backdrop-blur-sm rounded-2xl border p-1 shadow-sm">
                        <Filters
                            filters={filters}
                            setFilters={setFilters}
                            onAddClick={handleOpenCreate}
                        />
                    </div>

                    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                        <EnterpriseTable
                            enterprises={filteredEnterprises}
                            onEdit={handleOpenEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                </section>
            </motion.div>

            {/* Smooth Footer Info */}
            <footer className="px-4 md:px-8 py-12 border-t text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} SC Startup Radar — Inteligência em Ecossistemas.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                        <span>Status: Operational</span>
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span>Data Sync: Ready</span>
                    </div>
                </div>
            </footer>

            {/* Enterprise Form Modal */}
            <EnterpriseForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingEnterprise}
                onSubmit={handleFormSubmit}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
}
