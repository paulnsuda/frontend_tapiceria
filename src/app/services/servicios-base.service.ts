import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// 1. Importamos el environment (asegúrate de que la ruta coincida con la de tus carpetas)
import { environment } from '../../environments/environment';

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
  // 2. Reemplazamos el localhost por tu variable dinámica
  private apiUrl = `${environment.apiUrl}/servicios-base`; 

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