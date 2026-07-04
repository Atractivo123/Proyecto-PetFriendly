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

import { ClienteService } from '../../../../core/services/cliente.services';
import { MascotaService } from '../../../../core/services/mascota.services';
import { Cliente } from '../../../../models/cliente.models';
import { Mascota } from '../../../../models/mascota.models';

@Component({
  selector: 'app-mascota-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mascota-form.html',
  styleUrl: './mascota-form.css'
})
export class MascotaForm implements OnChanges, OnInit {

  @Input() mascotaEditar: Mascota | null = null;

  @Output() mascotaGuardada = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private mascotaService = inject(MascotaService);

  clientes: Cliente[] = [];
  cargandoClientes = false;
  modoEdicion = false;

  formulario = this.fb.nonNullable.group({

    nombre: ['', Validators.required],

    especie: ['', Validators.required],

    raza: [''],

    edad: [null as number | null],

    sexo: ['Macho' as 'Macho' | 'Hembra', Validators.required],

    cliente: ['', Validators.required],

    observaciones: ['']

  });

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['mascotaEditar']) {

      if (this.mascotaEditar) {

        this.modoEdicion = true;

        this.formulario.patchValue({

          nombre: this.mascotaEditar.nombre,
          especie: this.mascotaEditar.especie,
          raza: this.mascotaEditar.raza ?? '',
          edad: this.mascotaEditar.edad ?? null,
          sexo: this.mascotaEditar.sexo,
          cliente: this.obtenerClienteId(this.mascotaEditar.cliente),
          observaciones: this.mascotaEditar.observaciones ?? ''

        });

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

  guardar(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();
      return;

    }

    const datos = this.formulario.getRawValue() as Mascota;

    const peticion = this.modoEdicion && this.mascotaEditar?._id

      ? this.mascotaService.actualizarMascota(this.mascotaEditar._id, datos)

      : this.mascotaService.crearMascota(datos);

    peticion.subscribe({

      next: () => {

        alert(

          this.modoEdicion

            ? 'Mascota actualizada correctamente'

            : 'Mascota registrada correctamente'

        );

        this.limpiarFormulario();
        this.modoEdicion = false;
        this.mascotaEditar = null;

        this.mascotaGuardada.emit();

      },

      error: (error) => {

        console.error(error);

        alert('Ocurrio un error al guardar la mascota.');

      }

    });

  }

  private limpiarFormulario(): void {
    this.formulario.reset({
      nombre: '',
      especie: '',
      raza: '',
      edad: null,
      sexo: 'Macho',
      cliente: '',
      observaciones: ''
    });
  }

  private obtenerClienteId(cliente: string | Cliente): string {
    return typeof cliente === 'string' ? cliente : cliente._id ?? '';
  }

}
