export type CategoriaInventario =
  | 'Medicamentos'
  | 'Alimentos'
  | 'Accesorios'
  | 'Higiene'
  | 'Servicios'
  | 'Otros';

export type EstadoInventario = 'Activo' | 'Inactivo';

export interface InventarioProducto {

  _id?: string;

  nombre: string;

  categoria: CategoriaInventario;

  descripcion?: string;

  precio: number;

  stock: number;

  stockMinimo: number;

  estado: EstadoInventario;

  createdAt?: string;

  updatedAt?: string;

}