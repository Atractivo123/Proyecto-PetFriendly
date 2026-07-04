export interface ActividadDashboard {

  descripcion: string;

  fecha?: string;

}

export interface ProximaCitaDashboard {

  fecha: string;

  hora?: string;

  cliente?: string;

  mascota?: string;

  motivo?: string;

}

export interface Dashboard {

  totalClientes: number;

  totalMascotas: number;

  totalAgenda: number;

  totalInventario: number;

  totalVentas: number;

  ingresosTotales: number;

  actividad: ActividadDashboard[];

  proximasCitas: ProximaCitaDashboard[];

}
