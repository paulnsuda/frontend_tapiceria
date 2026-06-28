import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // <-- IMPORTANTE PARA EL BOTÓN
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MaterialsService } from '../../../services/materials.service';
import { MaterialFormComponent } from './material-form/material-form.component';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule
  ],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.css'
})
export class MaterialsComponent implements OnInit {
  listaMateriales: any[] = []; 
  
  // Las 4 columnas exactas
  columnasAMostrar: string[] = ['id', 'nombre', 'precio', 'acciones']; 

  constructor(
    private materialsService: MaterialsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarInventario();
  }

  cargarInventario() {
    this.materialsService.getMaterials().subscribe({
      next: (datos) => { this.listaMateriales = datos; },
      error: (err) => { console.error('Error al traer los materiales', err); }
    });
  }

  // Modifica esta función para aceptar el parámetro "material" (opcional)
  abrirFormulario(material?: any) {
    const dialogRef = this.dialog.open(MaterialFormComponent, {
      width: '450px',
      disableClose: true,
      data: material // <-- Le pasamos el material al formulario (si no viene, pasará undefined, que está perfecto)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarInventario(); // Recargamos la tabla si hubo cambios
      }
    });
  }

  eliminarMaterial(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${nombre}" del inventario?`)) {
      this.materialsService.deleteMaterial(id).subscribe({
        next: () => {
          alert('Material eliminado correctamente.');
          this.cargarInventario();
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('No se pudo eliminar el material.');
        }
      });
    }
  }
}