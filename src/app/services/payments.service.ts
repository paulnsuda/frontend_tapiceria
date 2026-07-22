import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// 1. Importamos el environment
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  // 2. Usamos tu variable dinámica para armar la ruta
  private apiUrl = `${environment.apiUrl}/payments`; 

  constructor(private http: HttpClient) { }

 private getHeaders() {
    // ¡Aquí estaba el detalle! Cambiamos 'access_token' por 'token'
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Traer todos los abonos de un trabajo en específico
  getPaymentsByJob(jobId: number) {
    // Ajustado al endpoint exacto de tu controlador
    return this.http.get<any>(`${this.apiUrl}/job/${jobId}`, { headers: this.getHeaders() });
  }

  // Registrar un nuevo abono
  createPayment(paymentData: any) {
    return this.http.post<any>(this.apiUrl, paymentData, { headers: this.getHeaders() });
  }
}