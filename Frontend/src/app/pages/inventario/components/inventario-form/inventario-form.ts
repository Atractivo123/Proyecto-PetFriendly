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

import { InventarioService } from '../../../../core/services/inventario.services';
import {
  CategoriaInventario,
  EstadoInventario,
  InventarioProducto
} from '../../../../models/inventario.models';

@Component({
  selector: 'app-inventario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventario-form.html',
  styleUrl: './inventario-form.css'
})
export class InventarioForm implements OnChanges {

  @Input() productoEditar: InventarioProducto | null = null;

  @Output() productoGuardado = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private inventarioService = inject(InventarioService);

  modoEdicion = false;

  categorias: CategoriaInventario[] = [
    'Medicamentos',
    'Alimentos',
    'Accesorios',
    'Higiene',
    'Servicios',
    'Otros'
  ];

  estados: EstadoInventario[] = [
    'Activo',
    'Inactivo'
  ];

  formulario = this.fb.nonNullable.group({

    nombre: ['', Validators.required],

    categoria: ['Otros' as CategoriaInventario, Validators.required],

    descripcion: [''],

    precio: [0, [Validators.required, Validators.min(0)]],

    stock: [0, [Validators.required, Validators.min(0)]],

    stockMinimo: [0, [Validators.required, Validators.min(0)]],

    estado: ['Activo' as EstadoInventario, Validators.required]

  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['productoEditar']) {

      if (this.productoEditar) {

        this.modoEdicion = true;

        this.formulario.patchValue({

          nombre: this.productoEditar.nombre,
          categoria: this.productoEditar.categoria,
          descripcion: this.productoEditar.descripcion ?? '',
          precio: this.productoEditar.precio,
          stock: this.productoEditar.stock,
          stockMinimo: this.productoEditar.stockMinimo,
          estado: this.productoEditar.estado

        });

      } else {

        this.modoEdicion = false;
        this.limpiarFormulario();

      }

    }

  }

  guardar(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();
      return;

    }

    const datos = this.formulario.getRawValue() as InventarioProducto;

    const peticion = this.modoEdicion && this.productoEditar?._id

      ? this.inventarioService.actualizarProducto(this.productoEditar._id, datos)

      : this.inventarioService.crearProducto(datos);

    peticion.subscribe({

      next: () => {

        alert(

          this.modoEdicion

            ? 'Producto actualizado correctamente'

            : 'Producto registrado correctamente'

        );

        this.limpiarFormulario();
        this.modoEdicion = false;
        this.productoEditar = null;

        this.productoGuardado.emit();

      },

      error: (error) => {

        console.error(error);

        alert('Ocurrio un error al guardar el producto.');

      }

    });

  }

  private limpiarFormulario(): void {

    this.formulario.reset({

      nombre: '',
      categoria: 'Otros',
      descripcion: '',
      precio: 0,
      stock: 0,
      stockMinimo: 0,
      estado: 'Activo'

    });

  }

}