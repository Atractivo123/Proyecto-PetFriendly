import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Venta } from '../../models/venta.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/ventas`;

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.api);
  }

  obtenerVenta(id: string): Observable<Venta> {
    return this.http.get<Venta>(`${this.api}/${id}`);
  }

  crearVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.api, venta);
  }

  anularVenta(id: string): Observable<Venta> {
    return this.http.put<Venta>(`${this.api}/${id}/anular`, {});
  }

}