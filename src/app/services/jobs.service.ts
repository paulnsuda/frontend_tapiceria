import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private apiUrl = 'http://localhost:3000/jobs'; // Ruta hacia el backend de trabajos

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

  // Crear un trabajo nuevo (lo usaremos más adelante)
  createJob(jobData: any) {
    return this.http.post<any>(this.apiUrl, jobData, { headers: this.getHeaders() });
  }

  // Actualizar un trabajo existente (Cambiar estado, presupuesto, etc.)
  updateJob(id: number, jobData: any) {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, jobData, { headers: this.getHeaders() });
  }

  // Eliminar un trabajo por completo
  deleteJob(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  
}