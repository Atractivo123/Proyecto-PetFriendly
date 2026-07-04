import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AgendaService } from '../../../../core/services/agenda.services';
import { ClienteService } from '../../../../core/services/cliente.services';
import { MascotaService } from '../../../../core/services/mascota.services';

import { Agenda, EstadoCita } from '../../../../models/agenda.models';
import { Cliente } from '../../../../models/cliente.models';
import { Mascota } from '../../../../models/mascota.models';

@Component({
  selector: 'app-agenda-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agenda-form.html',
  styleUrl: './agenda-form.css'
})
export class AgendaForm implements OnChanges, OnInit {

  @Input() citaEditar: Agenda | null = null;

  @Output() citaGuardada = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private agendaService = inject(AgendaService);
  private clienteService = inject(ClienteService);
  private mascotaService = inject(MascotaService);

  clientes: Cliente[] = [];
  mascotas: Mascota[] = [];
  mascotasFiltradas: Mascota[] = [];
  cargandoClientes = false;
  cargandoMascotas = false;
  modoEdicion = false;

  estados: EstadoCita[] = [
    'Pendiente',
    'Confirmada',
    'Cancelada',
    'Atendida'
  ];

  formulario = this.fb.nonNullable.group({

    cliente: ['', Validators.required],

    mascota: ['', Validators.required],

    fecha: ['', Validators.required],

    hora: ['', Validators.required],

    motivo: ['', Validators.required],

    estado: ['Pendiente' as EstadoCita, Validators.required],

    observaciones: ['']

  });

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarMascotas();

    this.formulario.controls.cliente.valueChanges.subscribe(() => {
      this.filtrarMascotasPorCliente();
      this.formulario.controls.mascota.setValue('');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['citaEditar']) {

      if (this.citaEditar) {

        this.modoEdicion = true;

        this.formulario.patchValue({

          cliente: this.obtenerClienteId(this.citaEditar.cliente),
          mascota: this.obtenerMascotaId(this.citaEditar.mascota),
          fecha: this.formatearFechaInput(this.citaEditar.fecha),
          hora: this.citaEditar.hora,
          motivo: this.citaEditar.motivo,
          estado: this.citaEditar.estado,
          observaciones: this.citaEditar.observaciones ?? ''

        });

        this.filtrarMascotasPorCliente(false);

      } else {

        this.modoEdicion = false;
        this.limpiarFormulario();

      }

    }

  }

  cargarClientes(): void {

    this.cargandoClientes = true;

    this.clienteService.obtenerClientes().subscribe({

      next: (clientes) => {
        this.clientes = clientes;
        this.cargandoClientes = false;
      },

      error: (error) => {
        console.error(error);
        this.cargandoClientes = false;
        alert('No fue posible cargar los clientes.');
      }

    });

  }

  cargarMascotas(): void {

    this.cargandoMascotas = true;

    this.mascotaService.obtenerMascotas().subscribe({

      next: (mascotas) => {
        this.mascotas = mascotas;
        this.filtrarMascotasPorCliente(false);
        this.cargandoMascotas = false;
      },

      error: (error) => {
        console.error(error);
        this.cargandoMascotas = false;
        alert('No fue posible cargar las mascotas.');
      }

    });

  }

  filtrarMascotasPorCliente(limpiarMascota = true): void {

    const clienteId = this.formulario.controls.cliente.value;

    this.mascotasFiltradas = this.mascotas.filter(mascota =>
      this.obtenerClienteId(mascota.cliente) === clienteId
    );

    if (limpiarMascota) {
      this.formulario.controls.mascota.setValue('');
    }

  }

  guardar(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();
      return;

    }

    const datos = this.formulario.getRawValue() as Agenda;

    const peticion = this.modoEdicion && this.citaEditar?._id

      ? this.agendaService.actualizarCita(this.citaEditar._id, datos)

      : this.agendaService.crearCita(datos);

    peticion.subscribe({

      next: () => {

        alert(

          this.modoEdicion

            ? 'Cita actualizada correctamente'

            : 'Cita registrada correctamente'

        );

        this.limpiarFormulario();
        this.modoEdicion = false;
        this.citaEditar = null;

        this.citaGuardada.emit();

      },

      error: (error) => {

        console.error(error);

        alert('Ocurrio un error al guardar la cita.');

      }

    });

  }

  private limpiarFormulario(): void {

    this.formulario.reset({

      cliente: '',
      mascota: '',
      fecha: '',
      hora: '',
      motivo: '',
      estado: 'Pendiente',
      observaciones: ''

    });

    this.mascotasFiltradas = [];

  }

  private obtenerClienteId(cliente: string | Cliente): string {
    return typeof cliente === 'string' ? cliente : cliente._id ?? '';
  }

  private obtenerMascotaId(mascota: string | Mascota): string {
    return typeof mascota === 'string' ? mascota : mascota._id ?? '';
  }

  private formatearFechaInput(fecha: string): string {
    return fecha ? fecha.substring(0, 10) : '';
  }

}
