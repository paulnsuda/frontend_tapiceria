import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importamos el componente de Login
import { LoginComponent } from './views/auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // 2. Lo agregamos aquí
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  // Nota: Si tu archivo dice styleUrl: './app.component.css', déjalo como esté
})
export class AppComponent {
  title = 'frontend-tapiceria';
}

