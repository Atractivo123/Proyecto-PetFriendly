import { Component, ViewChild } from '@angular/core';

import { Agenda as CitaAgenda } from '../../models/agenda.models';
import { AgendaForm } from './components/agenda-form/agenda-form';
import { AgendaList } from './components/agenda-list/agenda-list';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    AgendaForm,
    AgendaList
  ],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda {

  @ViewChild(AgendaList)
  listaAgenda!: AgendaList;

  mostrarFormulario = false;

  citaSeleccionada: CitaAgenda | null = null;

  abrirFormulario() {
    this.citaSeleccionada = null;
    this.mostrarFormulario = true;
  }

  editarCita(cita: CitaAgenda) {
    this.citaSeleccionada = cita;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.citaSeleccionada = null;
  }

  actualizarLista() {
    this.listaAgenda.cargarAgenda();
    this.cerrarFormulario();
  }

}