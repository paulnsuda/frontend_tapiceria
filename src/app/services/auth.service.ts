import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // La ruta exacta de tu backend que probamos en Postman
  private apiUrl = 'http://localhost:3000/auth'; 

  constructor(private http: HttpClient) { }

  // Función que el componente llamará al hacer clic en el botón
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
}
