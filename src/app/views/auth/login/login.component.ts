import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router'; 
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

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (respuesta) => {
        // 👇 AQUÍ ESTÁ LA MAGIA: Lo guardamos exactamente como 'token' para que el Guardián lo reconozca
        // (Usamos respuesta.access_token o respuesta.token dependiendo de cómo lo envíe tu backend)
        const tokenRecibido = respuesta.access_token || respuesta.token;
        localStorage.setItem('token', tokenRecibido);
        
        // ¡Viajamos al panel de control automáticamente!
        this.router.navigate(['/admin']); 
      },
      error: (err) => {
        console.error(err);
        alert('El correo o la contraseña son incorrectos.');
      }
    });
  }
}