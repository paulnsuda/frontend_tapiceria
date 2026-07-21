import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Revisamos si el token real existe en el navegador
  const token = localStorage.getItem('token');

  if (token) {
    // Si hay token, el guardián dice: "Adelante, puedes pasar"
    return true;
  } else {
    // Si no hay token, lo redirigimos de inmediato al formulario de inicio de sesión
    router.navigate(['/login']);
    return false;
  }
};