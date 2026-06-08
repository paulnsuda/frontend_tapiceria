import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { DashboardComponent } from './views/admin/dashboard/dashboard.component';


export const routes: Routes = [
  // Ruta para iniciar sesión
  { path: 'login', component: LoginComponent },
  
  // Ruta privada del dueño
  { path: 'admin', component: DashboardComponent },
  
  // Si alguien entra a la raíz de la página, lo mandamos al login por ahora
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Si alguien escribe una URL que no existe, también lo mandamos al login
  { path: '**', redirectTo: '/login' }
];