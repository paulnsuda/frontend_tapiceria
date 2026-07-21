import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JobsService } from '../../../services/jobs.service';

import { JobFormComponent } from './job-form/job-form.component';
import { JobPaymentsComponent } from './job-payments/job-payments.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
  listaTrabajos: any[] = [];
  // Actualizamos las columnas para incluir la placa y el costo
  columnasAMostrar: string[] = ['id', 'cliente', 'placa', 'descripcion', 'estado', 'costo', 'acciones']; 

  constructor(
    private jobsService: JobsService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarTrabajos();
  }

  cargarTrabajos() {
    this.jobsService.getJobs().subscribe({
      next: (datos) => { 
        this.listaTrabajos = datos; 
        this.cdr.detectChanges(); // <-- 2. Le decimos a Angular: "Ya llegaron los datos, redibuja la tabla sin pánico"
      },
      error: (err) => { console.error('Error al traer los trabajos', err); }
    });
  }

  abrirFormulario(trabajo?: any) {
    const dialogRef = this.dialog.open(JobFormComponent, {
      width: '520px',
      disableClose: true,
      data: trabajo 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarTrabajos();
    });
  }

  abrirPagos(trabajo: any) {
    const dialogRef = this.dialog.open(JobPaymentsComponent, {
      width: '600px', 
      disableClose: true,
      data: trabajo 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarTrabajos();
    });
  }

  eliminarTrabajo(id: number, clienteNombre: string) {
    if (confirm(`¿Estás seguro de eliminar la orden de trabajo de "${clienteNombre}"?`)) {
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