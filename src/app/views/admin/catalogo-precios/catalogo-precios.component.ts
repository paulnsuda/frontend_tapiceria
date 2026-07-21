
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiciosBaseService, ServicioBase } from '../../../services/servicios-base.service';

@Component({
  selector: 'app-catalogo-precios',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importamos FormsModule para poder leer las cajitas de texto
  templateUrl: './catalogo-precios.component.html',
  styleUrls: ['./catalogo-precios.component.css']
})
export class CatalogoPreciosComponent implements OnInit {
  // Aquí se guardará la lista que viene de la base de datos
  servicios: ServicioBase[] = [];
  
  // Aquí se guarda temporalmente lo que tú escribes antes de darle a "Guardar"
  nuevoServicio: ServicioBase = { nombre: '', precioSugerido: 0 };

  constructor(private serviciosService: ServiciosBaseService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarServicios(); // Al abrir la pantalla, carga los precios que ya existen
  }

  cargarServicios(): void {
    this.serviciosService.getServicios().subscribe(data => {
      this.servicios = data;
      this.cdRef.detectChanges(); // Forza la detección de cambios
    });
  }

guardarPrecio(): void {
    if (this.nuevoServicio.nombre && this.nuevoServicio.precioSugerido > 0) {
      this.serviciosService.createServicio(this.nuevoServicio).subscribe(() => {
        
        this.cargarServicios(); // Recarga la tabla de abajo
        
        // Envolvemos la limpieza de las cajitas en este "retraso" de 1 milisegundo
        // para que Angular no marque el error rojo en la consola.
        setTimeout(() => {
          this.nuevoServicio = { nombre: '', precioSugerido: 0 }; 
        });
        
      });
    } else {
      alert('Por favor, ingresa un nombre de trabajo y un precio válido.');
    }
  }
}