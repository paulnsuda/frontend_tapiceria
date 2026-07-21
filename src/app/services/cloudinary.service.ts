import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // Tus credenciales públicas de Cloudinary
  private cloudName = 'qkaong60'; 
  private uploadPreset = 'tapiceria_fotos'; 

  constructor(private http: HttpClient) { }

  // Función que recibe un archivo de tu computadora y lo envía a la nube
  subirImagen(archivo: File): Observable<any> {
    const data = new FormData();
    data.append('file', archivo);
    data.append('upload_preset', this.uploadPreset);
    data.append('cloud_name', this.cloudName);

    // Hacemos la petición directa a la API de Cloudinary
    return this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, data);
  }
}