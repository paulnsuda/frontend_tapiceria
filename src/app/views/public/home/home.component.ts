import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- 1. Importamos ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { JobsService } from '../../../services/jobs.service'; 
import { GalleryService } from '../../../services/gallery.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  placaBuscar: string = '';
  trabajoEncontrado: any = null;
  mensajeError: string = '';
  fotosCatalogo: any[] = [];
  fases = ['recepcion', 'desarmado', 'tapizado', 'armado', 'listo', 'entregado'];

  constructor(
    private jobsService: JobsService, 
    private galleryService: GalleryService,
    private cdr: ChangeDetectorRef // <-- 2. Lo inyectamos aquí
  ) {}

  ngOnInit() {
    this.galleryService.getFotos().subscribe({
      next: (data) => {
        this.fotosCatalogo = data;
        this.cdr.detectChanges(); // <-- 3. OBLIGAMOS a pintar las fotos en pantalla inmediatamente
      },
      error: (err) => console.error('Error al cargar catálogo', err)
    });
  }
  
  buscarVehiculo() {
    if (!this.placaBuscar) return;

    this.mensajeError = '';
    this.trabajoEncontrado = null;

    this.jobsService.trackJobByPlaca(this.placaBuscar.trim().toUpperCase()).subscribe({
      next: (job) => {
        this.trabajoEncontrado = job;
        this.cdr.detectChanges(); // <-- 4. OBLIGAMOS a mostrar la barra verde inmediatamente
      },
      error: (err) => {
        this.mensajeError = 'No encontramos ningún vehículo activo con esa placa en el taller.';
        this.cdr.detectChanges(); // <-- 5. OBLIGAMOS a mostrar el error inmediatamente
      }
    });
  }

  obtenerPorcentajeProgreso(estadoActual: string): number {
    const index = this.fases.indexOf(estadoActual);
    if (index === -1) return 0;
    return ((index + 1) / this.fases.length) * 100;
  }

  irA(seccion: string) {
    const elemento = document.getElementById(seccion);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
}