import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgendaService } from '../../../../core/services/agenda.services';
import { Agenda } from '../../../../models/agenda.models';
import { Cliente } from '../../../../models/cliente.models';
import { Mascota } from '../../../../models/mascota.models';

@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './agenda-list.html',
  styleUrl: './agenda-list.css'
})
export class AgendaList implements OnInit {

  private agendaService = inject(AgendaService);

  citas: Agenda[] = [];
  citasFiltradas: Agenda[] = [];
  textoBusqueda = '';

  @Output() editar = new EventEmitter<Agenda>();
  @Output() eliminado = new EventEmitter<void>();

  ngOnInit(): void {
    this.cargarAgenda();
  }

  cargarAgenda() {

    this.agendaService.obtenerAgenda().subscribe({

      next: (data) => {
        this.citas = data;
        this.citasFiltradas = data;
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  editarCita(cita: Agenda) {
    this.editar.emit(cita);
  }

  eliminarCita(cita: Agenda) {

    if (!cita._id) return;

    if (!confirm(`Eliminar la cita de ${this.obtenerNombreMascota(cita.mascota)}?`)) {
      return;
    }

    this.agendaService.eliminarCita(cita._id).subscribe({

      next: () => {
        this.cargarAgenda();
        this.eliminado.emit();
      },

      error: (err) => {
        console.error(err);
        alert('No fue posible eliminar la cita.');
      }

    });

  }

  buscar() {

    const texto = this.textoBusqueda.toLowerCase();

    this.citasFiltradas = this.citas.filter(cita =>

      this.obtenerNombreCliente(cita.cliente).toLowerCase().includes(texto)

      ||

      this.obtenerNombreMascota(cita.mascota).toLowerCase().includes(texto)

      ||

      cita.motivo.toLowerCase().includes(texto)

      ||

      cita.estado.toLowerCase().includes(texto)

      ||

      cita.hora.toLowerCase().includes(texto)

    );

  }

  obtenerNombreCliente(cliente: string | Cliente): string {
    if (typeof cliente === 'string') {
      return 'Sin cliente';
    }

    return `${cliente.nombre} ${cliente.apellido}`;
  }

  obtenerNombreMascota(mascota: string | Mascota): string {
    if (typeof mascota === 'string') {
      return 'Sin mascota';
    }

    return mascota.nombre;
  }

}