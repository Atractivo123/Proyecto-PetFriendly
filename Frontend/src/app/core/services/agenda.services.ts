import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Agenda } from '../../models/agenda.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/agenda`;

  obtenerAgenda(): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(this.api);
  }

  obtenerCita(id: string): Observable<Agenda> {
    return this.http.get<Agenda>(`${this.api}/${id}`);
  }

  crearCita(cita: Agenda): Observable<Agenda> {
    return this.http.post<Agenda>(this.api, cita);
  }

  actualizarCita(id: string, cita: Agenda): Observable<Agenda> {
    return this.http.put<Agenda>(`${this.api}/${id}`, cita);
  }

  eliminarCita(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

}