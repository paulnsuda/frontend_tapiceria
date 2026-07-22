import { ChangeDetectorRef } from '@angular/core'; // <-- Agrega esto junto a tus otros imports de @angular/core
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; 
import { ProformasService } from '../../../../services/proformas.service';
import { ServiciosBaseService } from '../../../../services/servicios-base.service';

// Importamos pdfMake
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Truco para evitar el bloqueo de seguridad de Angular moderno (ESBuild)
const pdf: any = pdfMake;
pdf.vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs;

@Component({
  selector: 'app-proforma-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatIconModule, MatSelectModule, MatDialogModule
  ],
  templateUrl: './proforma-form.component.html',
  styleUrls: ['./proforma-form.component.css']
})
export class ProformaFormComponent implements OnInit {
  proformaForm: FormGroup;
  isEditMode = false;
  proformaId?: number;

  serviciosCatalogo: any[] = []; 

  constructor(
    private fb: FormBuilder,
    private proformasService: ProformasService,
    private serviciosBase: ServiciosBaseService, // <--- 2. Lo inyectamos aquí
    public dialogRef: MatDialogRef<ProformaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    // 1. ESTRUCTURA ACTUALIZADA DEL FORMULARIO
    this.proformaForm = this.fb.group({
      numeroProforma: [''], // Ej: 048-2026
      clienteNombre: ['', Validators.required],
      cedulaRuc: [''],
      direccion: [''],
      telefonoContacto: [''],
      vehiculoModelo: [''],
      vehiculoAno: [''],
      vehiculoPlaca: [''],
      vehiculoColor: [''],
      
      // La nueva tabla mágica de servicios
      detallesServicio: this.fb.array([ this.crearFilaServicio() ]), 
      
      subtotal: [0],
      precioFinal: [0],
      estado: ['pendiente'],
      
      // Mantenemos lo que ya tenías
      descripcionTrabajo: [''], 
      precioEstimado: [0], // Lo mantenemos por compatibilidad
      porcentajeGanancia: [0],
      materialesUsados: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.cargarCatalogo();

    if (this.data && this.data.proforma) {
      this.isEditMode = true;
      this.proformaId = this.data.proforma.id;
      this.cargarProforma(this.proformaId!);
    } else {
      // Autogeneramos un número temporal de proforma basado en el año actual
      this.proformaForm.patchValue({ numeroProforma: `PRF-${Math.floor(Math.random() * 1000)}-2026` });
    }
  }

cargarCatalogo(): void {
    this.serviciosBase.getServicios().subscribe({
      next: (data) => {
        this.serviciosCatalogo = data;
        this.cdr.detectChanges(); // Silencia errores si la carga es asíncrona
      },
      error: (err) => {
        console.error('Activando catálogo de emergencia:', err);
        
        this.serviciosCatalogo = [
          { nombre: 'Tapizado de Tablero Bus', precioSugerido: 140 },
          { nombre: 'Tapizado Completo Hyundai H1', precioSugerido: 680 }
        ];
        this.cdr.detectChanges(); // <--- EL SILENCIADOR DEFINITIVO PARA EL NG0100
      }
    });
  }

  // Esta función se activa cuando eliges algo de la lista
 aplicarPrecioCatalogo(index: number): void {
    const fila = this.detallesServicio.at(index);
    const nombreIngresado = fila.get('descripcion')?.value;

    const servicioEncontrado = this.serviciosCatalogo.find(s => s.nombre === nombreIngresado);

    if (servicioEncontrado) {
      const precioReal = parseFloat(servicioEncontrado.precioSugerido);

      // 1. Forzamos a que la cantidad sea 1 si está vacía
      let cantidad = fila.get('cantidad')?.value;
      if (!cantidad || cantidad === 0) {
        fila.get('cantidad')?.setValue(1, { emitEvent: false });
        cantidad = 1;
      }

      // 2. Colocamos el precio unitario
      fila.get('unitario')?.setValue(precioReal, { emitEvent: false });

      // 3. Forzamos a calcular el "Total ($)" de esa fila exacta
      const totalFila = cantidad * precioReal;
      fila.get('total')?.setValue(totalFila, { emitEvent: false });

      // 4. Calculamos el gran total de abajo
      this.calcularTotales(); 
    }
  }

  // --- CONTROL DE LA TABLA DE SERVICIOS (LO NUEVO) ---
  get detallesServicio(): FormArray {
    return this.proformaForm.get('detallesServicio') as FormArray;
  }

  crearFilaServicio(): FormGroup {
    return this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]],
      descripcion: ['', Validators.required],
      unitario: [0], // Puede ser 0 si es cortesía
      total: [{ value: 0, disabled: true }] // Desactivado porque lo calcula el sistema
    });
  }

  agregarFilaServicio(): void {
    this.detallesServicio.push(this.crearFilaServicio());
  }

  eliminarFilaServicio(index: number): void {
    if (this.detallesServicio.length > 1) {
      this.detallesServicio.removeAt(index);
      this.calcularTotales();
    }
  }

 
  calcularTotales(): void {
    console.log('🔄 Ejecutando calculadora...'); // <-- El chismoso
    let sumaSubtotal = 0;

    this.detallesServicio.controls.forEach((fila, index) => {
      const cantidad = parseFloat(fila.get('cantidad')?.value) || 0;
      const unitario = parseFloat(fila.get('unitario')?.value) || 0;
      
      const totalFila = cantidad * unitario;
      
      // Esto te mostrará en la consola exactamente qué está multiplicando
      console.log(`Fila ${index + 1}: ${cantidad} x ${unitario} = ${totalFila}`);

      // Inyectamos el valor a la cajita "Total" de forma segura
      fila.patchValue({ total: totalFila }, { emitEvent: false });
      
      sumaSubtotal += totalFila;
    });

    console.log('💰 Subtotal final calculado:', sumaSubtotal);

    this.proformaForm.patchValue({
      subtotal: sumaSubtotal,
      precioFinal: sumaSubtotal,
      precioEstimado: sumaSubtotal
    }, { emitEvent: false });
  }

  // --- CONTROL DE LA TABLA DE MATERIALES (LO QUE YA TENÍAS) ---
  get materialesUsados(): FormArray {
    return this.proformaForm.get('materialesUsados') as FormArray;
  }
  agregarMaterial(): void { /* ... Tu lógica original ... */ }
  eliminarMaterial(index: number): void { this.materialesUsados.removeAt(index); }

  // --- GUARDAR Y CARGAR ---
  cargarProforma(id: number): void {
    this.proformasService.getProforma(id).subscribe(proforma => {
      this.proformaForm.patchValue(proforma);
      
      // Cargar tabla de servicios si existe
      if (proforma.detallesServicio && proforma.detallesServicio.length > 0) {
        this.detallesServicio.clear(); // Limpiamos la fila vacía por defecto
        proforma.detallesServicio.forEach((detalle: any) => {
          this.detallesServicio.push(this.fb.group({
            cantidad: [detalle.cantidad],
            descripcion: [detalle.descripcion],
            unitario: [detalle.unitario],
            total: [{ value: detalle.total, disabled: true }]
          }));
        });
      }
    });
  }

guardar(): void {
    if (this.proformaForm.invalid) {
      this.proformaForm.markAllAsTouched();
      return;
    }

    // 1. Forzamos el cálculo
    this.calcularTotales();
    
    // 2. Extraemos los datos crudos
    const datosProforma = this.proformaForm.getRawValue();

    // 3. PARCHE INDESTRUCTIBLE: Convertimos a número matemático sí o sí
    // por si alguna cajita lo está transformando en texto "680" en vez de 680
    datosProforma.subtotal = parseFloat(datosProforma.subtotal) || 0;
    datosProforma.precioFinal = parseFloat(datosProforma.precioFinal) || 0;
    datosProforma.precioEstimado = parseFloat(datosProforma.precioEstimado) || 0;

    // 4. EL CHISMOSO: Esto imprimirá los datos en la consola de tu navegador
    console.log('🚀 DATOS QUE SE VAN AL SERVIDOR:', datosProforma);

    if (this.isEditMode && this.proformaId) {
      this.proformasService.updateProforma(this.proformaId, datosProforma).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.proformasService.createProforma(datosProforma).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
  generarPDF(): void {
    // 1. Obtenemos todos los datos que escribiste en el formulario
    const data = this.proformaForm.getRawValue();

    // 2. Preparamos las filas de la tabla de servicios dinámicamente
    const filasServicios = [
      // Encabezados de la tabla con colores elegantes
      [
        { text: 'Cant.', bold: true, fillColor: '#1e293b', color: 'white', alignment: 'center', margin: [0, 5, 0, 5] },
        { text: 'Descripción del Trabajo', bold: true, fillColor: '#1e293b', color: 'white', margin: [0, 5, 0, 5] },
        { text: 'P. Unitario', bold: true, fillColor: '#1e293b', color: 'white', alignment: 'center', margin: [0, 5, 0, 5] },
        { text: 'Total', bold: true, fillColor: '#1e293b', color: 'white', alignment: 'center', margin: [0, 5, 0, 5] }
      ]
    ];

    // Llenamos la tabla con los datos reales
    data.detallesServicio.forEach((item: any) => {
      // Magia: Si el precio es 0 o no es un número, ponemos "Cortesía"
      let precioFormat = isNaN(parseFloat(item.unitario)) || item.unitario == 0 ? 'Cortesía' : `$${parseFloat(item.unitario).toFixed(2)}`;
      let totalFormat = isNaN(parseFloat(item.total)) || item.total == 0 ? 'Cortesía' : `$${parseFloat(item.total).toFixed(2)}`;

      const filasServicios: any[] = [  // <--- ¡SOLO AGREGA ESTE : any[] AQUÍ!
      // Encabezados de la tabla con colores elegantes
      [
        { text: 'Cant.', bold: true, fillColor: '#1e293b', color: 'white', alignment: 'center', margin: [0, 5, 0, 5] },
        { text: 'Descripción del Trabajo', bold: true, fillColor: '#1e293b', color: 'white', margin: [0, 5, 0, 5] },
        { text: 'P. Unitario', bold: true, fillColor: '#1e293b', color: 'white', alignment: 'center', margin: [0, 5, 0, 5] },
        { text: 'Total', bold: true, fillColor: '#1e293b', color: 'white', alignment: 'center', margin: [0, 5, 0, 5] }
      ]
    ];
    });

    // 3. DISEÑAMOS EL DOCUMENTO PDF (Idéntico a tu Word)
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 50, 40, 50],
      defaultStyle: { fontSize: 11, color: '#334155' },
      
      content: [
        // --- ENCABEZADO DE LA EMPRESA ---
        {
          columns: [
            {
              width: '60%',
              text: [
                { text: 'TAPICERÍA "EL GATO"\n', fontSize: 22, bold: true, color: '#0f172a' },
                { text: 'Elegancia y Confort en cada Detalle\n', italics: true, color: '#64748b', fontSize: 12 },
                { text: '\nRUC: 0104205554001\n', bold: true },
                { text: 'Dirección: Hurtado de Mendoza y Rio Palora, Cuenca, Ecuador\n' },
                { text: 'Teléfono: 0980993908 | Email: togachaval@gmail.com' }
              ]
            },
            {
              width: '40%',
              text: [
                { text: `PROFORMA No: ${data.numeroProforma || 'S/N'}\n`, fontSize: 16, bold: true, alignment: 'right', color: '#eab308' },
                { text: `Fecha: ${new Date().toLocaleDateString()}\n`, alignment: 'right', margin: [0, 5, 0, 0] },
                { text: 'Validez: 15 días calendario', alignment: 'right', color: '#ef4444', fontSize: 10, bold: true }
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // --- LINEA SEPARADORA ---
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 15] },

        // --- DATOS DEL CLIENTE Y VEHÍCULO ---
        {
          columns: [
            {
              width: '50%',
              text: [
                { text: 'DATOS DEL CLIENTE\n', bold: true, color: '#0f172a', fontSize: 12, margin: [0, 0, 0, 5] },
                { text: `Nombre: ${data.clienteNombre || '__________________'}\n` },
                { text: `C.I. / RUC: ${data.cedulaRuc || '__________________'}\n` },
                { text: `Teléfono: ${data.telefonoContacto || '__________________'}\n` },
                { text: `Dirección: ${data.direccion || '__________________'}` }
              ]
            },
            {
              width: '50%',
              text: [
                { text: 'ESPECIFICACIONES DEL VEHÍCULO\n', bold: true, color: '#0f172a', fontSize: 12, margin: [0, 0, 0, 5] },
                { text: `Marca/Modelo: ${data.vehiculoModelo || '__________________'}\n` },
                { text: `Año: ${data.vehiculoAno || '__________________'}\n` },
                { text: `Placa: ${data.vehiculoPlaca || '__________________'}\n` },
                { text: `Color: ${data.vehiculoColor || '__________________'}` }
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // --- TABLA DE SERVICIOS ---
        {
          table: {
            headerRows: 1,
            widths: ['10%', '55%', '15%', '20%'],
            body: filasServicios
          },
          layout: {
            hLineWidth: (i: number, node: any) => { return (i === 0 || i === node.table.body.length) ? 2 : 1; },
            vLineWidth: (i: number, node: any) => { return 0; },
            hLineColor: (i: number, node: any) => { return '#cbd5e1'; }
          },
          margin: [0, 0, 0, 15]
        },

        // --- TOTALES ---
        {
          columns: [
            { width: '*', text: '' }, // Espacio vacío a la izquierda
            {
              width: '35%',
              table: {
                widths: ['50%', '50%'],
                body: [
                  // ENVOLVEMOS LAS VARIABLES EN Number() PARA EVITAR EL ERROR
                  [ { text: 'SUBTOTAL:', bold: true, alignment: 'right', border: [false, false, false, false] }, { text: `$${Number(data.subtotal || 0).toFixed(2)}`, alignment: 'right', border: [false, false, false, false] } ],
                  [ { text: 'IVA (0%):', bold: true, alignment: 'right', border: [false, false, false, false] }, { text: '$0.00', alignment: 'right', border: [false, false, false, false] } ],
                  [ { text: 'TOTAL A PAGAR:', bold: true, alignment: 'right', fontSize: 13, border: [false, true, false, false] }, { text: `$${Number(data.precioFinal || 0).toFixed(2)}`, bold: true, alignment: 'right', fontSize: 13, border: [false, true, false, false] } ]
                ]
              }
            }
          ],
          margin: [0, 0, 0, 30]
        },

        // --- TÉRMINOS Y CONDICIONES ---
        {
          text: 'TÉRMINOS Y CONDICIONES', bold: true, fontSize: 12, color: '#0f172a', margin: [0, 0, 0, 5]
        },
        {
          ul: [
            'Forma de Pago: 50% de anticipo para inicio de obra y 50% contra entrega.',
            'Tiempo de Entrega: Acordado previamente (días laborables tras la recepción del vehículo).',
            'Garantía: Los trabajos cuentan con 1 año de garantía en costuras y defectos de material (aplicable en cualquier material elegido por el cliente).',
          ],
          margin: [0, 0, 0, 50],
          fontSize: 10
        },

        // --- FIRMAS ---
        {
          columns: [
            {
              width: '50%',
              stack: [
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }] },
                { text: 'Firma Autorizada\nTapicería El Gato\nGerente: Francisco Narvaez', margin: [0, 5, 0, 0], fontSize: 10 }
              ],
              alignment: 'center'
            },
            {
              width: '50%',
              stack: [
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }] },
                { text: 'Aceptación Cliente\nC.I.: _________________', margin: [0, 5, 0, 0], fontSize: 10 }
              ],
              alignment: 'center'
            }
          ]
        }
      ]
    };

    // 4. GENERAR EL PDF Y ABRIRLO EN OTRA PESTAÑA PARA IMPRIMIR
    
    const pdf: any = pdfMake;
    const creadorPDF = pdf.default || pdf; // Buscamos la función esté donde esté
    creadorPDF.createPdf(docDefinition).open();
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}