import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// 1. Importamos el environment
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  // 2. Usamos tu variable dinámica para armar la ruta
  private apiUrl = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) { }

  // Función para obtener la llave secreta del dueño guardada en el navegador
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // ¡Aquí mostramos el gafete VIP!
    });
  }

  // Ir al backend y traer todos los materiales
  getMaterials() {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createMaterial(material: any) {
    return this.http.post<any>(this.apiUrl, material, { headers: this.getHeaders() });
  }

  deleteMaterial(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Al final de la clase MaterialsService
  updateMaterial(id: number, material: any) {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, material, { headers: this.getHeaders() });
  }
}