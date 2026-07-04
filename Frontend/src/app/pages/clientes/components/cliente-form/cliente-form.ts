import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
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
import { Cliente } from '../../../../models/cliente.models';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css'
})
export class ClienteForm implements OnChanges {

  @Input() clienteEditar: Cliente | null = null;

  @Output() clienteGuardado = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  modoEdicion = false;

  formulario = this.fb.nonNullable.group({

    nombre: ['', Validators.required],

    apellido: ['', Validators.required],

    documento: ['', Validators.required],

    telefono: ['', Validators.required],

    correo: ['', [Validators.required, Validators.email]],

    direccion: ['']

  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['clienteEditar']) {

      if (this.clienteEditar) {

        this.modoEdicion = true;

        this.formulario.patchValue({

          nombre: this.clienteEditar.nombre,
          apellido: this.clienteEditar.apellido,
          documento: this.clienteEditar.documento,
          telefono: this.clienteEditar.telefono,
          correo: this.clienteEditar.correo,
          direccion: this.clienteEditar.direccion ?? ''

        });

      } else {

        this.modoEdicion = false;

        this.formulario.reset({

          nombre: '',
          apellido: '',
          documento: '',
          telefono: '',
          correo: '',
          direccion: ''

        });

      }

    }

  }

  guardar(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();
      return;

    }

    const datos = this.formulario.getRawValue() as Cliente;

    const peticion = this.modoEdicion && this.clienteEditar?._id

      ? this.clienteService.actualizarCliente(this.clienteEditar._id, datos)

      : this.clienteService.crearCliente(datos);

    peticion.subscribe({

      next: () => {

        alert(

          this.modoEdicion

            ? 'Cliente actualizado correctamente'

            : 'Cliente registrado correctamente'

        );

        this.formulario.reset({

          nombre: '',
          apellido: '',
          documento: '',
          telefono: '',
          correo: '',
          direccion: ''

        });

        this.modoEdicion = false;
        this.clienteEditar = null;

        this.clienteGuardado.emit();

      },

      error: (error) => {

        console.error(error);

        alert('Ocurrió un error al guardar el cliente.');

      }

    });

  }

}