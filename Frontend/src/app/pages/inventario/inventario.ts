import { Component, ViewChild } from '@angular/core';

import { InventarioProducto } from '../../models/inventario.models';
import { InventarioForm } from './components/inventario-form/inventario-form';
import { InventarioList } from './components/inventario-list/inventario-list';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    InventarioForm,
    InventarioList
  ],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario {

  @ViewChild(InventarioList)
  listaInventario!: InventarioList;

  mostrarFormulario = false;

  productoSeleccionado: InventarioProducto | null = null;

  abrirFormulario() {
    this.productoSeleccionado = null;
    this.mostrarFormulario = true;
  }

  editarProducto(producto: InventarioProducto) {
    this.productoSeleccionado = producto;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.productoSeleccionado = null;
  }

  actualizarLista() {
    this.listaInventario.cargarInventario();
    this.cerrarFormulario();
  }

}