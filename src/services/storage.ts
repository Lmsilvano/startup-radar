import { Enterprise } from '@/types/enterprise';

const STORAGE_KEY = '@sc-startup-radar:enterprises';
const SIMULATED_DELAY = 600; // Simulated network delay in ms

// Utility to pause execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getEnterprisesFromStorage = (): Enterprise[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveEnterprisesToStorage = (enterprises: Enterprise[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enterprises));
    }
};

export const api = {
    fetchEnterprises: async (): Promise<Enterprise[]> => {
        await delay(SIMULATED_DELAY);
        return getEnterprisesFromStorage();
    },

    createEnterprise: async (enterprise: Omit<Enterprise, 'id'>): Promise<Enterprise> => {
        await delay(SIMULATED_DELAY);
        const enterprises = getEnterprisesFromStorage();

        const newEnterprise: Enterprise = {
            ...enterprise,
            id: crypto.randomUUID(),
        };

        enterprises.push(newEnterprise);
        saveEnterprisesToStorage(enterprises);
        return newEnterprise;
    },

    updateEnterprise: async (id: string, updatedData: Partial<Enterprise>): Promise<Enterprise> => {
        await delay(SIMULATED_DELAY);
        const enterprises = getEnterprisesFromStorage();

        const index = enterprises.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Enterprise not found');

        const updatedEnterprise = { ...enterprises[index], ...updatedData };
        enterprises[index] = updatedEnterprise;

        saveEnterprisesToStorage(enterprises);
        return updatedEnterprise;
    },

    deleteEnterprise: async (id: string): Promise<void> => {
        await delay(SIMULATED_DELAY);
        const enterprises = getEnterprisesFromStorage();
        const filtered = enterprises.filter(e => e.id !== id);
        saveEnterprisesToStorage(filtered);
    }
};
