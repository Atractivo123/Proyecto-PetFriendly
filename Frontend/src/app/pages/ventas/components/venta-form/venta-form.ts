import {
  Component,
  EventEmitter,
  Output,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ClienteService } from '../../../../core/services/cliente.services';
import { InventarioService } from '../../../../core/services/inventario.services';
import { VentaService } from '../../../../core/services/venta.services';

import { Cliente } from '../../../../models/cliente.models';
import { InventarioProducto } from '../../../../models/inventario.models';
import { MetodoPagoVenta, Venta } from '../../../../models/venta.models';

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './venta-form.html',
  styleUrl: './venta-form.css'
})
export class VentaForm {

  @Output() ventaGuardada = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private inventarioService = inject(InventarioService);
  private ventaService = inject(VentaService);

  clientes: Cliente[] = [];
  productosInventario: InventarioProducto[] = [];
  cargandoClientes = false;
  cargandoProductos = false;

  metodosPago: MetodoPagoVenta[] = [
    'Efectivo',
    'Tarjeta',
    'Transferencia',
    'Otro'
  ];

  formulario = this.fb.nonNullable.group({

    cliente: ['', Validators.required],

    metodoPago: ['Efectivo' as MetodoPagoVenta, Validators.required],

    observaciones: [''],

    productos: this.fb.array([])

  });

  constructor() {
    this.cargarClientes();
    this.cargarProductos();
    this.agregarProducto();
  }

  get productos(): FormArray {
    return this.formulario.controls.productos as FormArray;
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

  cargarProductos(): void {

    this.cargandoProductos = true;

    this.inventarioService.obtenerInventario().subscribe({

      next: (productos) => {
        this.productosInventario = productos.filter(producto => producto.estado === 'Activo');
        this.cargandoProductos = false;
      },

      error: (error) => {
        console.error(error);
        this.cargandoProductos = false;
        alert('No fue posible cargar los productos.');
      }

    });

  }

  crearProductoForm() {
    return this.fb.nonNullable.group({
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  agregarProducto(): void {
    this.productos.push(this.crearProductoForm());
  }

  eliminarProducto(index: number): void {
    if (this.productos.length === 1) {
      alert('La venta debe tener al menos un producto.');
      return;
    }

    this.productos.removeAt(index);
  }

  obtenerProducto(productoId: string): InventarioProducto | undefined {
    return this.productosInventario.find(producto => producto._id === productoId);
  }

  obtenerStock(index: number): number {
    const productoId = this.productos.at(index).get('producto')?.value;
    return this.obtenerProducto(productoId)?.stock ?? 0;
  }

  obtenerPrecio(index: number): number {
    const productoId = this.productos.at(index).get('producto')?.value;
    return this.obtenerProducto(productoId)?.precio ?? 0;
  }

  obtenerSubtotal(index: number): number {
    const cantidad = this.productos.at(index).get('cantidad')?.value ?? 0;
    return this.obtenerPrecio(index) * cantidad;
  }

  obtenerTotal(): number {
    return this.productos.controls.reduce((total, _control, index) =>
      total + this.obtenerSubtotal(index), 0
    );
  }

  hayProductosRepetidos(): boolean {
    const ids = this.productos.controls
      .map(control => control.get('producto')?.value)
      .filter(id => !!id);

    return new Set(ids).size !== ids.length;
  }

  hayStockInsuficiente(): boolean {
    return this.productos.controls.some((control, index) => {
      const cantidad = control.get('cantidad')?.value ?? 0;
      const stock = this.obtenerStock(index);

      return cantidad > stock;
    });
  }

  guardar(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();
      return;

    }

    if (this.hayProductosRepetidos()) {
      alert('No se permiten productos repetidos dentro de una misma venta.');
      return;
    }

    if (this.hayStockInsuficiente()) {
      alert('Uno o más productos no tienen stock suficiente.');
      return;
    }

   const datos = this.formulario.getRawValue();

const productosVenta = datos.productos as Array<{
  producto: string;
  cantidad: number;
}>;

const venta: Venta = {
  cliente: datos.cliente,
  productos: productosVenta.map(item => ({
    producto: item.producto,
    cantidad: item.cantidad
  })),
  metodoPago: datos.metodoPago,
  observaciones: datos.observaciones
};

    this.ventaService.crearVenta(venta).subscribe({

      next: () => {

        alert('Venta registrada correctamente');

        this.limpiarFormulario();

        this.ventaGuardada.emit();

      },

      error: (error) => {

        console.error(error);

        alert(error.error?.mensaje || 'Ocurrio un error al registrar la venta.');

      }

    });

  }

  private limpiarFormulario(): void {

    this.formulario.reset({
      cliente: '',
      metodoPago: 'Efectivo',
      observaciones: '',
      productos: []
    });

    this.productos.clear();
    this.agregarProducto();
    this.cargarProductos();

  }

}
