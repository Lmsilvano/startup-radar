import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/storage';
import { Enterprise } from '@/types/enterprise';
import { useToast } from './useToast';

export const ENTERPRISES_QUERY_KEY = ['enterprises'];

export function useEnterprises() {
    return useQuery({
        queryKey: ENTERPRISES_QUERY_KEY,
        queryFn: () => api.fetchEnterprises(),
    });
}

export function useCreateEnterprise() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (newEnterprise: Omit<Enterprise, 'id'>) => api.createEnterprise(newEnterprise),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ENTERPRISES_QUERY_KEY });
            toast.success('Empreendimento cadastrado com sucesso!');
        },
        onError: () => {
            toast.error('Não foi possível realizar o cadastro.');
        },
    });
}

export function useUpdateEnterprise() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Enterprise> }) =>
            api.updateEnterprise(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ENTERPRISES_QUERY_KEY });
            toast.success('Informações atualizadas com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao atualizar as informações.');
        },
    });
}

export function useDeleteEnterprise() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (id: string) => api.deleteEnterprise(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ENTERPRISES_QUERY_KEY });
            toast.success('Empreendimento removido do radar.');
        },
        onError: () => {
            toast.error('Não foi possível remover o registro.');
        },
    });
}
