import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Mascota } from '../../models/mascota.models';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/mascotas`;

  obtenerMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.api);
  }

  obtenerMascota(id: string): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.api}/${id}`);
  }

  crearMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.api, mascota);
  }

  actualizarMascota(id: string, mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.api}/${id}`, mascota);
  }

  eliminarMascota(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

}
