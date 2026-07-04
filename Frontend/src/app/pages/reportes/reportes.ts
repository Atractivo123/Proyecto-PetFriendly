import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ReporteService } from '../../core/services/reporte.services';
import {
  ReporteAgenda,
  ReporteClientes,
  ReporteDashboard,
  ReporteInventario,
  ReporteVentas
} from '../../models/reporte.models';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {

  private reporteService = inject(ReporteService);
  private cdr = inject(ChangeDetectorRef);

  reporteDashboard: ReporteDashboard | null = null;
  reporteVentas: ReporteVentas | null = null;
  reporteInventario: ReporteInventario | null = null;
  reporteAgenda: ReporteAgenda | null = null;
  reporteClientes: ReporteClientes | null = null;

  cargando = false;
  error = '';

  ngOnInit(): void {
    this.cargarReportes();
  }

  get reportesCargados(): boolean {
    return !!(
      this.reporteDashboard ||
      this.reporteVentas ||
      this.reporteInventario ||
      this.reporteAgenda ||
      this.reporteClientes
    );
  }

  cargarReportes(): void {

    this.cargando = true;
    this.error = '';

    forkJoin({
      dashboard: this.reporteService.obtenerReporteDashboard(),
      ventas: this.reporteService.obtenerReporteVentas(),
      inventario: this.reporteService.obtenerReporteInventario(),
      agenda: this.reporteService.obtenerReporteAgenda(),
      clientes: this.reporteService.obtenerReporteClientes()
    }).subscribe({
      next: (reportes) => {
        this.reporteDashboard = reportes.dashboard;
        this.reporteVentas = reportes.ventas;
        this.reporteInventario = reportes.inventario;
        this.reporteAgenda = reportes.agenda;
        this.reporteClientes = reportes.clientes;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => this.manejarError(err)
    });

  }

  private manejarError(error: unknown): void {
    console.error(error);
    this.error = 'No fue posible cargar los reportes.';
    this.cargando = false;
    this.cdr.detectChanges();
  }

}
