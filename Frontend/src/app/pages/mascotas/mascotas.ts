import { Component, ViewChild } from '@angular/core';

import { Mascota } from '../../models/mascota.models';
import { MascotaForm } from './components/mascota-form/mascota-form';
import { MascotaList } from './components/mascota-list/mascota-list';

@Component({
  selector: 'app-mascotas',
  imports: [
    MascotaForm,
    MascotaList
  ],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css',
})
export class Mascotas {

  @ViewChild(MascotaList)
  listaMascotas!: MascotaList;

  mostrarFormulario = false;

  mascotaSeleccionada: Mascota | null = null;

  abrirFormulario() {
    this.mascotaSeleccionada = null;
    this.mostrarFormulario = true;
  }

  editarMascota(mascota: Mascota) {
    this.mascotaSeleccionada = mascota;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.mascotaSeleccionada = null;
  }

  actualizarLista() {
    this.listaMascotas.cargarMascotas();
    this.cerrarFormulario();
  }

}
