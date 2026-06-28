import { Component } from '@angular/core';
import { MaterialsComponent } from '../materials/materials.component';
import { JobsComponent } from '../jobs/jobs.component'; // <-- 1. Importamos tu nuevo módulo
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs'; // <-- 2. Importamos las pestañas

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MaterialsComponent, 
    JobsComponent, // <-- Agregado aquí
    MatToolbarModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatTabsModule // <-- Agregado aquí
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {}