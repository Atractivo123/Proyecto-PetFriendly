import { Cliente } from './cliente.models';

export interface Mascota {

  _id?: string;

  nombre: string;

  especie: string;

  raza?: string;

  edad?: number | null;

  sexo: 'Macho' | 'Hembra';

  cliente: string | Cliente;

  observaciones?: string;

}
