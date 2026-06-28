import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  // Ruta hacia el backend de pagos (ajustaremos si tu backend usa otro nombre)
  private apiUrl = 'http://localhost:3000/pagos'; 

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Traer todos los abonos de un trabajo en específico
  getPaymentsByJob(jobId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/trabajo/${jobId}`, { headers: this.getHeaders() });
  }

  // Registrar un nuevo abono
  createPayment(paymentData: any) {
    return this.http.post<any>(this.apiUrl, paymentData, { headers: this.getHeaders() });
  }
}