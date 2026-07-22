import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// 1. Importamos el environment
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  // 2. Usamos tu variable dinámica para la ruta principal de trabajos
  private apiUrl = `${environment.apiUrl}/jobs`; 

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Traer todos los trabajos
  getJobs() {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // 🔥 NUEVO: Traer UN SOLO trabajo por su ID (Necesario para ver sus materiales)
  getJobById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Crear un trabajo nuevo
  createJob(jobData: any) {
    return this.http.post<any>(this.apiUrl, jobData, { headers: this.getHeaders() });
  }

  // Actualizar un trabajo existente
  updateJob(id: number, jobData: any) {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, jobData, { headers: this.getHeaders() });
  }

  // Eliminar un trabajo por completo
  deleteJob(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // 🔥 NUEVO: Conectar con el backend para obtener alertas
  getAlertasAgenda() {
    return this.http.get<any[]>(`${this.apiUrl}/alertas/agenda`, { headers: this.getHeaders() }); 
  }

  // 🔥 NUEVO: Mandar la orden al backend para descontar stock y sumar al costo del trabajo
  agregarMaterial(jobId: number, materialId: number, cantidadUsada: number) {
    return this.http.post<any>(`${this.apiUrl}/${jobId}/materials`, {
      materialId: materialId,
      cantidadUsada: cantidadUsada
    }, { headers: this.getHeaders() });
  }

  // Rastreo público por placa
  trackJobByPlaca(placa: string) {
    // 3. ¡OJO AQUÍ! Cambiamos la ruta quemada de localhost por el environment
    return this.http.get<any>(`${environment.apiUrl}/track/${placa}`);
  }

}