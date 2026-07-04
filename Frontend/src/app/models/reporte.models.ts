export interface ReporteDashboard {
  totalClientes: number;
  totalMascotas: number;
  totalCitas: number;
  totalProductos: number;
  totalVentas: number;
  ingresosTotales: number;
}

export interface VentaPorMetodoPago {
  _id: string;
  totalVentas: number;
  ingresos: number;
}

export interface ReporteVentas {
  totalVentas: number;
  ventasAnuladas: number;
  ingresosTotales: number;
  ventasPorMetodoPago: VentaPorMetodoPago[];
}

export interface ProductoReporte {
  _id: string;
  nombre: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  estado: string;
}

export interface ReporteInventario {
  totalProductos: number;
  productosActivos: number;
  productosInactivos: number;
  totalBajoStock: number;
  totalSinStock: number;
  productosBajoStock: ProductoReporte[];
  productosSinStock: ProductoReporte[];
}

export interface CitaPorEstado {
  _id: string;
  total: number;
}

export interface ReporteAgenda {
  totalCitas: number;
  citasPendientes: number;
  citasConfirmadas: number;
  citasAtendidas: number;
  citasCanceladas: number;
  citasPorEstado: CitaPorEstado[];
}

export interface ClienteConMascotas {
  clienteId: string;
  nombre: string;
  apellido: string;
  documento: string;
  totalMascotas: number;
}

export interface ReporteClientes {
  totalClientes: number;
  totalMascotas: number;
  promedioMascotasPorCliente: number;
  clientesConMasMascotas: ClienteConMascotas[];
}