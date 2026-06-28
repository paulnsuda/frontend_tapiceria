import { Component, Inject, OnInit } from '@angular/core'; // <-- Añadimos Inject y OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // <-- Añadimos MAT_DIALOG_DATA
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MaterialsService } from '../../../../services/materials.service';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.css'
})
export class MaterialFormComponent implements OnInit {
  nuevoMaterial = {
    nombre: '',
    precioUnitario: 0,
    unidadMedida: 'unidad'
  };
  
  esEdicion = false; // Bandera para saber el modo

  constructor(
    private materialsService: MaterialsService,
    private dialogRef: MatDialogRef<MaterialFormComponent>,
    // ¡Aquí recibimos los datos del material si hacemos clic en Editar!
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {}

  ngOnInit() {
    // Si la data existe, significa que el usuario dio clic en "Editar"
    if (this.data) {
      this.nuevoMaterial = { ...this.data }; // Clonamos los datos para no alterar la tabla antes de guardar
      this.esEdicion = true;
    }
  }

  guardar() {
    if (this.esEdicion) {
      // Si es edición, llamamos a actualizar
      this.materialsService.updateMaterial(this.data.id, this.nuevoMaterial).subscribe({
        next: () => {
          alert('Material actualizado con éxito');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar el material');
        }
      });
    } else {
      // Si no, es un registro nuevo (código anterior)
      this.materialsService.createMaterial(this.nuevoMaterial).subscribe({
        next: () => {
          alert('Material guardado exitosamente');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          alert('No se pudo guardar el material');
        }
      });
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}