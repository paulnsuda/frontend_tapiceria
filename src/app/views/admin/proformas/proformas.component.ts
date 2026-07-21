import { Component, OnInit, ChangeDetectorRef,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProformasService, Proforma } from '../../../services/proformas.service';
import { ProformaFormComponent } from './proforma-form/proforma-form.component';

// ✅ AHORA SÍ: Importamos tu JobsService correcto
import { JobsService } from '../../../services/jobs.service'; 

@Component({
  selector: 'app-proformas',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './proformas.component.html',
  styleUrls: ['./proformas.component.css']
})
export class ProformasComponent implements OnInit {
  proformas: Proforma[] = [];
  displayedColumns: string[] = ['id', 'clienteNombre', 'vehiculoModelo', 'precioEstimado', 'estado', 'acciones'];

  @Output() notificarCambio = new EventEmitter<void>();

  constructor(
    private proformasService: ProformasService, 
    private jobsService: JobsService, // ✅ Inyectamos JobsService
    private dialog: MatDialog, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProformas();
  }

  cargarProformas(): void {
    this.proformasService.getProformas().subscribe(data => {
      this.proformas = data;
      this.cdr.detectChanges(); 
    });
  }

  abrirFormulario(proforma?: Proforma): void {
    const dialogRef = this.dialog.open(ProformaFormComponent, {
      width: '900px',
      disableClose: true,
      data: { proforma: proforma || null }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.cargarProformas();
      }
    });
  }

  eliminarProforma(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      this.proformasService.deleteProforma(id).subscribe(() => this.cargarProformas());
    }
  }

  // --- EL PUENTE MÁGICO: CONVERTIR PROFORMA A TRABAJO ---
  // --- EL PUENTE MÁGICO: CONVERTIR PROFORMA A TRABAJO ---
  convertirATrabajo(proforma: any): void {
    const confirmar = confirm(`¿Estás seguro de convertir la proforma de ${proforma.clienteNombre} a un Trabajo activo?`);
    if (!confirmar) return;

    // Empacamos los datos para tu CreateJobDto
    const nuevoTrabajo = {
      clienteNombre: proforma.clienteNombre,
      placaVehiculo: proforma.vehiculoPlaca || 'PENDIENTE', 
      descripcion: `Trabajo generado desde la Proforma: ${proforma.numeroProforma || 'S/N'}`, 
      costoTotal: proforma.precioFinal || proforma.precioEstimado || 0,
      
      // 👇 ¡AQUÍ ESTÁ LA MAGIA CORREGIDA! (en minúsculas) 👇
      estado: 'recepcion' 
    };

    this.jobsService.createJob(nuevoTrabajo).subscribe({
      next: () => {
        alert('¡Trabajo creado con éxito! Ya puedes verlo en Gestión de Trabajos.');
        
        // Cambiamos el estado de la proforma a aprobada (en minúsculas por si acaso tu BD también lo pide así)
        this.proformasService.updateProforma(proforma.id, { estado: 'aceptada' }).subscribe(() => {
          this.cargarProformas(); 

          this.notificarCambio.emit();
        });
      },
      error: (err: any) => {
        console.error('Error al convertir a trabajo:', err);
        alert('Hubo un problema al crear el trabajo. Revisa la consola.');
      }
    });
  }
}