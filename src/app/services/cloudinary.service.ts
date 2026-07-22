import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// 1. Importamos el environment
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // 2. Tomamos los valores desde el environment
  private cloudName = environment.cloudinaryName; 
  private uploadPreset = environment.cloudinaryPreset; 

  constructor(private http: HttpClient) { }

  // Función que recibe un archivo de tu computadora y lo envía a la nube
subirImagen(archivo: File): Observable<any> {
    const data = new FormData();
    data.append('file', archivo);
    data.append('upload_preset', this.uploadPreset);
    data.append('cloud_name', this.cloudName);

    // Hacemos la petición directa a la API de Cloudinary usando la variable dinámica
    return this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, data);
  }
}