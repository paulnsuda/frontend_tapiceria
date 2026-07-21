import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core'; 
import { JobsService } from '../../../../services/jobs.service';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()], 
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css'
})
export class JobFormComponent implements OnInit {
 
 nuevoTrabajo: any = {
  clienteNombre: '',
  placaVehiculo: '',
  descripcion: '',
  costoTotal: null,
  estado: 'recepcion',
  fechaEntrega: ''
};

  esEdicion = false;

  constructor(
    private jobsService: JobsService,
    private dialogRef: MatDialogRef<JobFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // <-- Recibimos la orden si es edición
  ) {}

  ngOnInit() {
    if (this.data) {
      this.nuevoTrabajo = { ...this.data }; // Clonamos los datos existentes
      this.esEdicion = true;
    }
  }

  guardar() {
    // 1. Extraemos SOLO los datos escalares para evitar que TypeORM colapse con las relaciones
    const datosLimpios = {
      clienteNombre: this.nuevoTrabajo.clienteNombre,
      placaVehiculo: this.nuevoTrabajo.placaVehiculo,
      descripcion: this.nuevoTrabajo.descripcion,
      costoTotal: Number(this.nuevoTrabajo.costoTotal), // Aseguramos que sea número
      estado: this.nuevoTrabajo.estado,
      fechaEntrega: this.nuevoTrabajo.fechaEntrega
    };

    if (this.esEdicion) {
      this.jobsService.updateJob(this.nuevoTrabajo.id, datosLimpios).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error(err);
          alert('Error al actualizar la orden');
        }
      });
    } else {
      this.jobsService.createJob(datosLimpios).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error(err);
          alert('Error al crear la orden');
        }
      });
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}