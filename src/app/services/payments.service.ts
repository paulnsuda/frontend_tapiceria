import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  // Ajustado al nombre exacto de tu controlador en NestJS
  private apiUrl = 'http://localhost:3000/payments'; 

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('access_token');
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