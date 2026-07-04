import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClienteService } from '../../../../core/services/cliente.services';
import { Cliente } from '../../../../models/cliente.models';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css'
})
export class ClienteList implements OnInit {

  private clienteService = inject(ClienteService);

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  textoBusqueda = '';
  @Output() editar = new EventEmitter<Cliente>();
  @Output() eliminado = new EventEmitter<void>();

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {

    this.clienteService.obtenerClientes().subscribe({

      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  editarCliente(cliente: Cliente) {
    this.editar.emit(cliente);
  }

  eliminarCliente(cliente: Cliente) {

    if (!cliente._id) return;

    if (!confirm(`¿Eliminar a ${cliente.nombre}?`)) {
      return;
    }

    this.clienteService.eliminarCliente(cliente._id).subscribe({

      next: () => {
        this.cargarClientes();
        this.eliminado.emit();
      },

      error: (err) => {
        console.error(err);
        alert('No fue posible eliminar el cliente.');
      }

    });

  }

buscar() {

  const texto = this.textoBusqueda.toLowerCase();

  this.clientesFiltrados = this.clientes.filter(cliente =>

    cliente.nombre.toLowerCase().includes(texto)

    ||

    cliente.apellido.toLowerCase().includes(texto)

    ||

    cliente.documento.includes(texto)

    ||

    cliente.telefono.includes(texto)

    ||

    cliente.correo.toLowerCase().includes(texto)

  );

}

}