import { Cliente } from './cliente.models';
import { InventarioProducto } from './inventario.models';

export type MetodoPagoVenta =
  | 'Efectivo'
  | 'Tarjeta'
  | 'Transferencia'
  | 'Otro';

export type EstadoVenta = 'Pagada' | 'Anulada';

export interface VentaProducto {

  producto: string | InventarioProducto;

  cantidad: number;

  precioUnitario?: number;

  subtotal?: number;

}

export interface Venta {

  _id?: string;

  cliente: string | Cliente;

  productos: VentaProducto[];

  total?: number;

  metodoPago: MetodoPagoVenta;

  estado?: EstadoVenta;

  fechaVenta?: string;

  fechaAnulacion?: string;

  observaciones?: string;

  createdAt?: string;

  updatedAt?: string;

}