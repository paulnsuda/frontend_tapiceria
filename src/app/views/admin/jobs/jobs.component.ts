import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JobsService } from '../../../services/jobs.service';

// 1. ESTAS IMPORTACIONES SE QUEDAN (TypeScript las necesita para el Dialog)
import { JobFormComponent } from './job-form/job-form.component';
import { JobPaymentsComponent } from './job-payments/job-payments.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  // 2. AQUÍ ES DONDE LOS QUITAMOS (Solo dejamos los módulos de Material y CommonModule)
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
  listaTrabajos: any[] = [];
  // Agregamos 'acciones' al final de las columnas
  columnasAMostrar: string[] = ['id', 'cliente', 'descripcion', 'estado', 'presupuesto', 'acciones']; 

  constructor(
    private jobsService: JobsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarTrabajos();
  }

  cargarTrabajos() {
    this.jobsService.getJobs().subscribe({
      next: (datos) => { this.listaTrabajos = datos; },
      error: (err) => { console.error('Error al traer los trabajos', err); }
    });
  }

  // Modificado para recibir un trabajo opcional en caso de edición
  abrirFormulario(trabajo?: any) {
    const dialogRef = this.dialog.open(JobFormComponent, {
      width: '520px',
      disableClose: true,
      data: trabajo // Pasamos la orden si existe
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarTrabajos();
    });
  }

  abrirPagos(trabajo: any) {
    const dialogRef = this.dialog.open(JobPaymentsComponent, {
      width: '600px', // Un poco más ancha para mostrar el historial de pagos
      disableClose: true,
      data: trabajo // Le pasamos TODA la orden de trabajo a la ventana de pagos
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarTrabajos();
    });
  }

  eliminarTrabajo(id: number, cliente: string) {
    if (confirm(`¿Estás seguro de eliminar la orden de trabajo de "${cliente}"?`)) {
      this.jobsService.deleteJob(id).subscribe({
        next: () => {
          alert('Orden de trabajo eliminada.');
          this.cargarTrabajos();
        },
        error: (err) => {
          console.error(err);
          alert('No se pudo eliminar la orden.');
        }
      });
    }
  }
}