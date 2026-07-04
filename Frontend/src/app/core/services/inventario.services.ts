import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { InventarioProducto } from '../../models/inventario.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/inventario`;

  obtenerInventario(): Observable<InventarioProducto[]> {
    return this.http.get<InventarioProducto[]>(this.api);
  }

  obtenerProducto(id: string): Observable<InventarioProducto> {
    return this.http.get<InventarioProducto>(`${this.api}/${id}`);
  }

  crearProducto(producto: InventarioProducto): Observable<InventarioProducto> {
    return this.http.post<InventarioProducto>(this.api, producto);
  }

  actualizarProducto(id: string, producto: InventarioProducto): Observable<InventarioProducto> {
    return this.http.put<InventarioProducto>(`${this.api}/${id}`, producto);
  }

  eliminarProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

}