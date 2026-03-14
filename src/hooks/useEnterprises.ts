import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/storage';
import { Enterprise } from '@/types/enterprise';

export const ENTERPRISES_QUERY_KEY = ['enterprises'];

export function useEnterprises() {
    return useQuery({
        queryKey: ENTERPRISES_QUERY_KEY,
        queryFn: () => api.fetchEnterprises(),
    });
}

export function useCreateEnterprise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newEnterprise: Omit<Enterprise, 'id'>) => api.createEnterprise(newEnterprise),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ENTERPRISES_QUERY_KEY });
        },
    });
}

export function useUpdateEnterprise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Enterprise> }) =>
            api.updateEnterprise(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ENTERPRISES_QUERY_KEY });
        },
    });
}

export function useDeleteEnterprise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.deleteEnterprise(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ENTERPRISES_QUERY_KEY });
        },
    });
}
