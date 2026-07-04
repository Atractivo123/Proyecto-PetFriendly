import { Component, ViewChild } from '@angular/core';

import { VentaForm } from './components/venta-form/venta-form';
import { VentaList } from './components/venta-list/venta-list';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    VentaForm,
    VentaList
  ],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas {

  @ViewChild(VentaList)
  listaVentas!: VentaList;

  mostrarFormulario = false;

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  actualizarLista() {
    this.listaVentas.cargarVentas();
    this.cerrarFormulario();
  }

}