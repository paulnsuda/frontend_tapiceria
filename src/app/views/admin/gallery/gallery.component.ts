import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { GalleryService } from '../../../services/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule, MatCardModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  fotos: any[] = [];
  tituloNuevo = '';
  archivoSeleccionado: File | null = null;
  subiendo = false;

  constructor(
    private cloudinary: CloudinaryService,
    private galleryService: GalleryService
  ) {}

  ngOnInit() {
    this.cargarFotos();
  }

  cargarFotos(): void { // O como se llame tu función
    this.galleryService.getFotos().subscribe(data => {
      // Pon este setTimeout para darle a Angular una milésima de segundo para respirar
      setTimeout(() => {
        this.fotos = data; // (O el nombre de la variable donde guardas tus fotos)
      });
    });
  }

  // Se ejecuta cuando eliges una foto de tu computadora
  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  subirFoto() {
    if (!this.archivoSeleccionado || !this.tituloNuevo) {
      alert('Por favor ponle un título y selecciona una foto.');
      return;
    }

    this.subiendo = true;

    // 1. Enviamos la foto a Cloudinary
    this.cloudinary.subirImagen(this.archivoSeleccionado).subscribe({
      next: (respuestaCloudinary) => {
        const urlSegura = respuestaCloudinary.secure_url; // ¡Aquí está el link!

        // 2. Guardamos el link en tu base de datos
        this.galleryService.guardarFoto(this.tituloNuevo, urlSegura).subscribe({
          next: () => {
            this.tituloNuevo = '';
            this.archivoSeleccionado = null;
            this.subiendo = false;
            this.cargarFotos(); // Recargamos la tabla
            alert('¡Foto subida con éxito al catálogo!');
          },
          error: (err) => {
            console.error('Error al guardar en BD', err);
            this.subiendo = false;
          }
        });
      },
      error: (err) => {
        console.error('Error en Cloudinary', err);
        alert('Hubo un error al subir la foto a la nube.');
        this.subiendo = false;
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta foto del catálogo?')) {
      this.galleryService.eliminarFoto(id).subscribe(() => {
        this.cargarFotos();
      });
    }
  }
}