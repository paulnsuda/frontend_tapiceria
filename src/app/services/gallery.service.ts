import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private apiUrl = 'http://localhost:3000/gallery';

  constructor(private http: HttpClient) { }

  // Agrega la llave de seguridad (Token)
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getFotos() {
    return this.http.get<any[]>(this.apiUrl); // Es pública
  }

  guardarFoto(titulo: string, url: string) {
    return this.http.post(this.apiUrl, { titulo, url }, { headers: this.getHeaders() });
  }

  eliminarFoto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}