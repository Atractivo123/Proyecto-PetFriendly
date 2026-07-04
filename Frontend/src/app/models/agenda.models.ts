import { Cliente } from './cliente.models';
import { Mascota } from './mascota.models';

export type EstadoCita = 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Atendida';

export interface Agenda {

  _id?: string;

  cliente: string | Cliente;

  mascota: string | Mascota;

  fecha: string;

  hora: string;

  motivo: string;

  estado: EstadoCita;

  observaciones?: string;

  createdAt?: string;

  updatedAt?: string;

}