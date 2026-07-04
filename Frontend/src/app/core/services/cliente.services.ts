import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Cliente } from '../../models/cliente.models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);

private api = `${environment.apiUrl}/clientes`;

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  obtenerCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.api}/${id}`);
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.api, cliente);
  }

  actualizarCliente(id: string, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.api}/${id}`, cliente);
  }

  eliminarCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

}