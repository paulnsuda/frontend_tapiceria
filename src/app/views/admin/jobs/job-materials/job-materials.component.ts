import { Component, Input, OnInit } from '@angular/core';
// 👇 AHORA SÍ: Importamos CommonModule y FormsModule
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

import { JobsService } from '../../../../services/jobs.service';
import { MaterialsService } from '../../../../services/materials.service';

@Component({
  selector: 'app-job-materials',
  templateUrl: './job-materials.component.html',
  styleUrls: ['./job-materials.component.css'],
  standalone: true, // Aseguramos que sea standalone
  // 👇 Aquí le decimos a Angular que este componente usa formularios y ciclos
  imports: [CommonModule, FormsModule] 
})
export class JobMaterialsComponent implements OnInit {
  @Input() jobId!: number; 
  
  availableMaterials: any[] = [];
  jobMaterials: any[] = []; 
  
  selectedMaterialId: number = 0;
  cantidad: number = 1;

  constructor(
    private jobsService: JobsService,
    private materialsService: MaterialsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.materialsService.getMaterials().subscribe((data: any) => {
      this.availableMaterials = data;
    });

    this.jobsService.getJobById(this.jobId).subscribe((job: any) => {
      this.jobMaterials = job.materialesUsados || [];
    });
  }

  agregarMaterial() {
    if (this.selectedMaterialId > 0 && this.cantidad > 0) {
      this.jobsService.agregarMaterial(this.jobId, this.selectedMaterialId, this.cantidad)
        .subscribe(() => {
          alert('Material agregado y stock descontado');
          this.loadData(); 
        });
    }
  }
}