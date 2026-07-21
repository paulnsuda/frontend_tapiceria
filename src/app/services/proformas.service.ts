import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ¡Aquí estamos exportando 'Proforma' para que el componente la encuentre!
export interface Proforma {
  id?: number;
  numeroProforma?: string;
  clienteNombre: string;
  cedulaRuc?: string;
  direccion?: string;
  telefonoContacto?: string;
  vehiculoModelo?: string;
  vehiculoAno?: string;
  vehiculoPlaca?: string;
  vehiculoColor?: string;
  detallesServicio?: any[]; // <-- ¡Aquí está el que faltaba!
  descripcionTrabajo?: string;
  subtotal?: number;
  precioEstimado?: number;
  precioFinal?: number;
  estado?: string;
  materialesUsados?: any[];
  porcentajeGanancia?: number;
  fechaCreacion?: string | Date;
  fechaValidez?: string;
}

// ¡Aquí estamos exportando 'ProformasService' para que el componente lo use!
@Injectable({
  providedIn: 'root'
})
export class ProformasService {
  private apiUrl = 'http://localhost:3000/proformas';

  constructor(private http: HttpClient) { }

  getProformas(): Observable<Proforma[]> {
    return this.http.get<Proforma[]>(this.apiUrl);
  }

  getProforma(id: number): Observable<Proforma> {
    return this.http.get<Proforma>(`${this.apiUrl}/${id}`);
  }

  createProforma(proforma: Proforma): Observable<Proforma> {
    return this.http.post<Proforma>(this.apiUrl, proforma);
  }

  updateProforma(id: number, proforma: Partial<Proforma>): Observable<Proforma> {
    return this.http.patch<Proforma>(`${this.apiUrl}/${id}`, proforma);
  }

  deleteProforma(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}