import { Component, OnInit } from '@angular/core'; // <-- Importamos OnInit
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Importante para usar el formato de moneda (Currency Pipe)

// Tus componentes
import { MaterialsComponent } from '../materials/materials.component';
import { JobsComponent } from '../jobs/jobs.component';
import { ProformasComponent } from '../proformas/proformas.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { CatalogoPreciosComponent } from '../catalogo-precios/catalogo-precios.component';

// Material Design
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs'; 

// 👇 IMPORTAMOS TUS SERVICIOS (Revisa que la ruta sea la correcta)
import { JobsService } from '../../../services/jobs.service';
import { MaterialsService } from '../../../services/materials.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, // <-- Agregamos CommonModule aquí
    MaterialsComponent, 
    JobsComponent, 
    MatToolbarModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatTabsModule,
    ProformasComponent,
    GalleryComponent,
    CatalogoPreciosComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // VARIABLES REALES QUE SE MOSTRARÁN EN LA PANTALLA
  trabajosActivos: number = 0;
  ingresosTotales: number = 0;
  materialesBajos: number = 0;

  constructor(
    private router: Router,
    private jobsService: JobsService, // <-- Inyectamos el servicio de Trabajos
    private materialsService: MaterialsService // <-- Inyectamos el servicio de Materiales
  ) {}

  // Esto se ejecuta apenas abres la pantalla principal
  ngOnInit(): void {
    this.cargarMetricasReales();
  }

  cargarMetricasReales() {
    // 1. Calculamos Trabajos e Ingresos
    this.jobsService.getJobs().subscribe(jobs => {
      // Contamos los trabajos que NO estén entregados (es decir, siguen activos en el taller)
      this.trabajosActivos = jobs.filter((j: any) => j.estado !== 'entregado').length;
      
      // Sumamos el costo total de todos los trabajos para saber cuánto dinero se está moviendo
      this.ingresosTotales = jobs.reduce((suma: number, job: any) => suma + Number(job.costoTotal || 0), 0);
    });

    // 2. Calculamos los Materiales Bajos en Stock (Ejemplo: menos de 5 unidades)
    // Cambia el getMaterials() por la función que uses en tu servicio si se llama distinto
    this.materialsService.getMaterials().subscribe(materiales => {
      this.materialesBajos = materiales.filter((m: any) => m.cantidad < 5).length;
    });
  }

  cerrarSesion() {
    localStorage.clear(); 
    this.router.navigate(['/login']); 
  }
}