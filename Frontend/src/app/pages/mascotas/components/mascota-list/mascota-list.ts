import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MascotaService } from '../../../../core/services/mascota.services';
import { Cliente } from '../../../../models/cliente.models';
import { Mascota } from '../../../../models/mascota.models';

@Component({
  selector: 'app-mascota-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './mascota-list.html',
  styleUrl: './mascota-list.css'
})
export class MascotaList implements OnInit {

  private mascotaService = inject(MascotaService);

  mascotas: Mascota[] = [];
  mascotasFiltradas: Mascota[] = [];
  textoBusqueda = '';

  @Output() editar = new EventEmitter<Mascota>();
  @Output() eliminado = new EventEmitter<void>();

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas() {

    this.mascotaService.obtenerMascotas().subscribe({

      next: (data) => {
        this.mascotas = data;
        this.mascotasFiltradas = data;
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  editarMascota(mascota: Mascota) {
    this.editar.emit(mascota);
  }

  eliminarMascota(mascota: Mascota) {

    if (!mascota._id) return;

    if (!confirm(`Eliminar a ${mascota.nombre}?`)) {
      return;
    }

    this.mascotaService.eliminarMascota(mascota._id).subscribe({

      next: () => {
        this.cargarMascotas();
        this.eliminado.emit();
      },

      error: (err) => {
        console.error(err);
        alert('No fue posible eliminar la mascota.');
      }

    });

  }

  buscar() {

    const texto = this.textoBusqueda.toLowerCase();

    this.mascotasFiltradas = this.mascotas.filter(mascota =>

      mascota.nombre.toLowerCase().includes(texto)

      ||

      mascota.especie.toLowerCase().includes(texto)

      ||

      (mascota.raza ?? '').toLowerCase().includes(texto)

      ||

      this.obtenerNombreCliente(mascota.cliente).toLowerCase().includes(texto)

    );

  }

  obtenerNombreCliente(cliente: string | Cliente): string {
    if (typeof cliente === 'string') {
      return 'Sin cliente';
    }

    return `${cliente.nombre} ${cliente.apellido}`;
  }

}
