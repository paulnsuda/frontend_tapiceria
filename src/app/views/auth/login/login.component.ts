import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router'; // <-- 1. Importar el Router
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  // 2. Inyectar el Router aquí junto al servicio
  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (respuesta) => {
        // Guardamos la llave
        localStorage.setItem('token', respuesta.access_token);
        
        // 3. ¡Viajamos al panel de control automáticamente!
        this.router.navigate(['/admin']); 
      },
      error: (err) => {
        alert('El correo o la contraseña son incorrectos.');
      }
    });
  }
}