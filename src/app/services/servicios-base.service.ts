import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Esta es la estructura de tus precios base
export interface ServicioBase {
  id?: number;
  nombre: string;
  precioSugerido: number;
  categoria?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServiciosBaseService {
  // Asegúrate de que esta URL sea la misma que usas en tus otros servicios (ej. proformas.service.ts)
  private apiUrl = 'http://localhost:3000/servicios-base'; 

  constructor(private http: HttpClient) {}

  // Obtener todos los precios
  getServicios(): Observable<ServicioBase[]> {
    return this.http.get<ServicioBase[]>(this.apiUrl);
  }

  // Crear un nuevo precio base
  createServicio(servicio: ServicioBase): Observable<ServicioBase> {
    return this.http.post<ServicioBase>(this.apiUrl, servicio);
  }
}