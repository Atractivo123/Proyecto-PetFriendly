import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DashboardService } from '../../core/services/dashboard.services';
import { ActividadDashboard, ProximaCitaDashboard } from '../../models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  totalClientes = 0;
  totalMascotas = 0;
  totalAgenda = 0;
  totalInventario = 0;
  totalVentas = 0;
  ingresosTotales = 0;
  actividad: ActividadDashboard[] = [];
  proximasCitas: ProximaCitaDashboard[] = [];
  cargando = false;
  error = '';
  fechaActual = new Date();
  saludo = '';
  usuario = 'Juan Manuel';

  ngOnInit(): void {

    this.obtenerSaludo();
    this.cargarDashboard();

  }

  cargarDashboard(): void {

    this.cargando = true;
    this.error = '';

    this.dashboardService.obtenerDashboard().subscribe({

      next: (dashboard) => {


  this.totalClientes = dashboard.totalClientes;
  this.totalMascotas = dashboard.totalMascotas;
  this.totalAgenda = dashboard.totalAgenda;
  this.totalInventario = dashboard.totalInventario;
  this.totalVentas = dashboard.totalVentas;
  this.ingresosTotales = dashboard.ingresosTotales;
  this.actividad = dashboard.actividad;
  this.proximasCitas = dashboard.proximasCitas;
  this.cargando = false;

  this.cdr.detectChanges();

},

      error: (err) => {

        console.error('Error Dashboard:', err);
        this.error = 'No fue posible cargar la informacion del dashboard.';
        this.cargando = false;
        this.cdr.detectChanges();

      }

    });

  }

  obtenerSaludo(): void {

    const hora = new Date().getHours();

    if (hora < 12) {

      this.saludo = '🌅 Buenos días';

    } else if (hora < 18) {

      this.saludo = '☀️ Buenas tardes';

    } else {

      this.saludo = '🌙 Buenas noches';

    }

  }

}
