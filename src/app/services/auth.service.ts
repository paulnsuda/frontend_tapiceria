import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// 1. Importamos el environment
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 2. Usamos tu variable dinámica para la ruta de autenticación
  private apiUrl = `${environment.apiUrl}/auth`; 

  constructor(private http: HttpClient) { }

  // Función que el componente llamará al hacer clic en el botón
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
}