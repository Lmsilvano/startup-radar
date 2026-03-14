import { z } from 'zod';

import { SC_CITIES } from '@/data/sc-cities';

export enum Segment {
  TECHNOLOGY = 'Tecnologia',
  COMMERCE = 'Comércio',
  INDUSTRY = 'Indústria',
  SERVICES = 'Serviços',
  AGRIBUSINESS = 'Agronegócio',
}

export const enterpriseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'O nome do empreendimento deve ter pelo menos 2 caracteres.'),
  entrepreneur: z.string().min(2, 'O nome do empreendedor deve ter pelo menos 2 caracteres.'),
  city: z.string()
    .min(2, 'O município é obrigatório.')
    .refine((val) => SC_CITIES.includes(val), {
      message: 'Selecione uma cidade válida de Santa Catarina.',
    }),
  segment: z.nativeEnum(Segment, {
    error: 'Selecione um segmento válido.',
  }),
  contact: z.string().min(5, 'O contato é obrigatório (e-mail ou telefone).'),
  isActive: z.boolean(),

  // Opcionais
  foundationDate: z.string().optional(),
  website: z.string().url('URL inválida.').optional().or(z.literal('')),
  employeeCount: z.number().int().min(0).optional(),
  description: z.string().max(500, 'A descrição não pode ter mais de 500 caracteres.').optional(),
});

export type Enterprise = z.infer<typeof enterpriseSchema>;
