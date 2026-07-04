import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ReporteAgenda,
  ReporteClientes,
  ReporteDashboard,
  ReporteInventario,
  ReporteVentas
} from '../../models/reporte.models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/reportes`;

  obtenerReporteDashboard(): Observable<ReporteDashboard> {
    return this.http.get<ReporteDashboard>(`${this.api}/dashboard`);
  }

  obtenerReporteVentas(): Observable<ReporteVentas> {
    return this.http.get<ReporteVentas>(`${this.api}/ventas`);
  }

  obtenerReporteInventario(): Observable<ReporteInventario> {
    return this.http.get<ReporteInventario>(`${this.api}/inventario`);
  }

  obtenerReporteAgenda(): Observable<ReporteAgenda> {
    return this.http.get<ReporteAgenda>(`${this.api}/agenda`);
  }

  obtenerReporteClientes(): Observable<ReporteClientes> {
    return this.http.get<ReporteClientes>(`${this.api}/clientes`);
  }

}