import { Component, ViewChild } from '@angular/core';

import { Cliente } from '../../models/cliente.models';

import { ClienteForm } from './components/cliente-form/cliente-form';
import { ClienteList } from './components/cliente-list/cliente-list';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    ClienteForm,
    ClienteList
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes {

  @ViewChild(ClienteList)
  listaClientes!: ClienteList;

  mostrarFormulario = false;

  clienteSeleccionado: Cliente | null = null;

  abrirFormulario() {

    this.clienteSeleccionado = null;
    this.mostrarFormulario = true;

  }

  editarCliente(cliente: Cliente) {

    this.clienteSeleccionado = cliente;
    this.mostrarFormulario = true;

  }

  cerrarFormulario() {

    this.mostrarFormulario = false;
    this.clienteSeleccionado = null;

  }

  actualizarLista() {

    this.listaClientes.cargarClientes();

    this.cerrarFormulario();

  }

}