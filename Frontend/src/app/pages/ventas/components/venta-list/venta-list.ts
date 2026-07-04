import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VentaService } from '../../../../core/services/venta.services';
import { Cliente } from '../../../../models/cliente.models';
import { InventarioProducto } from '../../../../models/inventario.models';
import { Venta } from '../../../../models/venta.models';

@Component({
  selector: 'app-venta-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './venta-list.html',
  styleUrl: './venta-list.css'
})
export class VentaList implements OnInit {

  private ventaService = inject(VentaService);

  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  textoBusqueda = '';

  @Output() anulada = new EventEmitter<void>();

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas() {

    this.ventaService.obtenerVentas().subscribe({

      next: (data) => {
        this.ventas = data;
        this.ventasFiltradas = data;
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  anularVenta(venta: Venta) {

    if (!venta._id) return;

    if (venta.estado === 'Anulada') {
      alert('La venta ya se encuentra anulada.');
      return;
    }

    if (!confirm(`Anular la venta de ${this.obtenerNombreCliente(venta.cliente)}?`)) {
      return;
    }

    this.ventaService.anularVenta(venta._id).subscribe({

      next: () => {
        this.cargarVentas();
        this.anulada.emit();
      },

      error: (err) => {
        console.error(err);
        alert('No fue posible anular la venta.');
      }

    });

  }

  buscar() {

    const texto = this.textoBusqueda.toLowerCase();

    this.ventasFiltradas = this.ventas.filter(venta =>

      this.obtenerNombreCliente(venta.cliente).toLowerCase().includes(texto)

      ||

      venta.metodoPago.toLowerCase().includes(texto)

      ||

      (venta.estado ?? '').toLowerCase().includes(texto)

      ||

      this.obtenerResumenProductos(venta).toLowerCase().includes(texto)

    );

  }

  obtenerNombreCliente(cliente: string | Cliente): string {
    if (typeof cliente === 'string') {
      return 'Sin cliente';
    }

    return `${cliente.nombre} ${cliente.apellido}`;
  }

  obtenerNombreProducto(producto: string | InventarioProducto): string {
    if (typeof producto === 'string') {
      return 'Producto';
    }

    return producto.nombre;
  }

  obtenerResumenProductos(venta: Venta): string {
    return venta.productos
      .map(item => `${this.obtenerNombreProducto(item.producto)} x${item.cantidad}`)
      .join(', ');
  }

}