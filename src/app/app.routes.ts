import { Routes } from '@angular/router';

// --- IMPORTACIONES DE AUTENTICACIÓN Y DASHBOARD ---
import { LoginComponent } from './views/auth/login/login.component';
import { DashboardComponent } from './views/admin/dashboard/dashboard.component';

// --- IMPORTACIONES DE TRABAJOS ---
import { JobsComponent } from './views/admin/jobs/jobs.component';
import { JobFormComponent } from './views/admin/jobs/job-form/job-form.component';
import { JobMaterialsComponent } from './views/admin/jobs/job-materials/job-materials.component';
import { JobPaymentsComponent } from './views/admin/jobs/job-payments/job-payments.component';

// --- IMPORTACIONES DE MATERIALES (INVENTARIO) ---
import { MaterialsComponent } from './views/admin/materials/materials.component';
import { MaterialFormComponent } from './views/admin/materials/material-form/material-form.component';

// --- IMPORTACIONES DE PROFORMAS ---
import { ProformasComponent } from './views/admin/proformas/proformas.component';
import { ProformaFormComponent } from './views/admin/proformas/proforma-form/proforma-form.component';

// --- IMPORTACIONES PÚBLICAS Y SEGURIDAD ---
import { authGuard } from './guards/auth-guard'; // Corregida la extensión a .guard
import { HomeComponent } from './views/public/home/home.component';
import { CatalogoPreciosComponent } from './views/admin/catalogo-precios/catalogo-precios.component';


export const routes: Routes = [

  
  // ----- RUTAS PÚBLICAS -----
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // ----- RUTA PRINCIPAL DEL DUEÑO -----
  { path: 'admin', component: DashboardComponent, canActivate: [authGuard] },
  
  // ----- RUTAS DE TRABAJOS -----
  { path: 'admin/trabajos', component: JobsComponent, canActivate: [authGuard] },
  { path: 'admin/trabajos/nuevo', component: JobFormComponent, canActivate: [authGuard] },
  { path: 'admin/trabajos/editar/:id', component: JobFormComponent, canActivate: [authGuard] },
  { path: 'admin/trabajos/:id/materiales', component: JobMaterialsComponent, canActivate: [authGuard] },
  { path: 'admin/trabajos/:id/pagos', component: JobPaymentsComponent, canActivate: [authGuard] },

  // ----- RUTAS DE MATERIALES (INVENTARIO) -----
  { path: 'admin/materiales', component: MaterialsComponent, canActivate: [authGuard] },
  { path: 'admin/materiales/nuevo', component: MaterialFormComponent, canActivate: [authGuard] },
  { path: 'admin/materiales/editar/:id', component: MaterialFormComponent, canActivate: [authGuard] },

  // ----- RUTAS DE PROFORMAS -----
  { path: 'admin/proformas', component: ProformasComponent, canActivate: [authGuard] },
  { path: 'admin/proformas/nueva', component: ProformaFormComponent, canActivate: [authGuard] },
  { path: 'admin/proformas/editar/:id', component: ProformaFormComponent, canActivate: [authGuard] },
  
  // ----- REDIRECCIONES POR DEFECTO -----
  // Si entran a la raíz (localhost:4200), van a la página de bienvenida
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Si escriben una URL que no existe, también van a la página de bienvenida
  { path: '**', redirectTo: '/home' },

  { path: 'catalogo-precios', component: CatalogoPreciosComponent },
  
];