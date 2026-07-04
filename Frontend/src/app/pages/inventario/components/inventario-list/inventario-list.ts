import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventarioService } from '../../../../core/services/inventario.services';
import { InventarioProducto } from '../../../../models/inventario.models';

@Component({
  selector: 'app-inventario-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventario-list.html',
  styleUrl: './inventario-list.css'
})
export class InventarioList implements OnInit {

  private inventarioService = inject(InventarioService);

  productos: InventarioProducto[] = [];
  productosFiltrados: InventarioProducto[] = [];
  textoBusqueda = '';

  @Output() editar = new EventEmitter<InventarioProducto>();
  @Output() eliminado = new EventEmitter<void>();

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario() {

    this.inventarioService.obtenerInventario().subscribe({

      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  editarProducto(producto: InventarioProducto) {
    this.editar.emit(producto);
  }

  eliminarProducto(producto: InventarioProducto) {

    if (!producto._id) return;

    if (!confirm(`Eliminar el producto ${producto.nombre}?`)) {
      return;
    }

    this.inventarioService.eliminarProducto(producto._id).subscribe({

      next: () => {
        this.cargarInventario();
        this.eliminado.emit();
      },

      error: (err) => {
        console.error(err);
        alert('No fue posible eliminar el producto.');
      }

    });

  }

  buscar() {

    const texto = this.textoBusqueda.toLowerCase();

    this.productosFiltrados = this.productos.filter(producto =>

      producto.nombre.toLowerCase().includes(texto)

      ||

      producto.categoria.toLowerCase().includes(texto)

      ||

      producto.estado.toLowerCase().includes(texto)

      ||

      (producto.descripcion ?? '').toLowerCase().includes(texto)

    );

  }

}