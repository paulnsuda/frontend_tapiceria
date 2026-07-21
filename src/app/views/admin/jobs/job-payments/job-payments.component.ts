import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { PaymentsService } from '../../../../services/payments.service';

@Component({
  selector: 'app-job-payments',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatTableModule, 
    MatIconModule
  ],
  templateUrl: './job-payments.component.html',
  styleUrl: './job-payments.component.css'
})
export class JobPaymentsComponent implements OnInit {
  historialPagos: any[] = [];
  columnasAMostrar: string[] = ['fecha', 'monto'];

  nuevoAbono = { monto: 0 };
  
  // Variables matemáticas para la interfaz
  totalPagado: number = 0;
  saldoPendiente: number = 0;

  constructor(
    private paymentsService: PaymentsService,
    private dialogRef: MatDialogRef<JobPaymentsComponent>,
    @Inject(MAT_DIALOG_DATA) public trabajo: any // Recibimos la orden de trabajo completa
  ) {}

 ngOnInit() {
    // 1. Usamos costoTotal (así lo renombramos en pasos anteriores)
    this.saldoPendiente = Number(this.trabajo.costoTotal);
    
    // 2. Luego intentamos buscar si hay abonos
    this.cargarPagos();
  }

  cargarPagos() {
    this.paymentsService.getPaymentsByJob(this.trabajo.id).subscribe({
      next: (res) => {
        // Tu backend devuelve un objeto con { jobId, totalAbonado, historial }
        this.historialPagos = res.historial; 
        this.calcularSaldos();
      },
      error: (err) => console.error('Error al cargar historial de pagos', err)
    });
  }

  calcularSaldos() {
    this.totalPagado = this.historialPagos.reduce((suma, pago) => suma + Number(pago.monto), 0);
    // Aseguramos que la resta se haga con números puros
    this.saldoPendiente = Number(this.trabajo.costoTotal) - this.totalPagado;
  }

  registrarAbono() {
    // 1. Forzamos que el monto capturado se convierta en un número matemático real
    const montoNumerico = Number(this.nuevoAbono.monto);

    if (montoNumerico <= 0 || montoNumerico > this.saldoPendiente) {
      alert('Monto inválido.');
      return;
    }

    const pagoData = {
      monto: montoNumerico,
      jobId: Number(this.trabajo.id), // Aseguramos que el ID también sea número
      tipoPago: montoNumerico === this.saldoPendiente ? 'saldo' : 'anticipo'
    };

    this.paymentsService.createPayment(pagoData).subscribe({
      next: () => {
        this.nuevoAbono.monto = 0; // Vaciamos la cajita
        this.cargarPagos(); // Recargamos para actualizar las matemáticas en tiempo real
      },
      error: (err) => {
        console.error('Error detallado del backend:', err);
        alert('Error al registrar el abono en la base de datos.');
      }
    });
  }

  cerrar() {
    this.dialogRef.close(true); // Refresca la tabla de atrás al cerrar
  }
}