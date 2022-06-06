import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Estudiante } from 'src/app/models/estudiante';
import { Respuesta } from 'src/app/models/respuesta';
import { EstudianteService } from 'src/app/services/estudiante.service';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {

  listaEstudiante: Estudiante[];
  listaRespuesta: Respuesta[];

  regNumeros = '^[0-9]|[1-2][0-9]$';
  regTextoUnaLinea = '^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+';
  regNombre = '^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ]$';

  cargando = false;

  seleccionEditar: Estudiante;
  seleccionRespuesta: Respuesta;
  notaRespuesta: string = '0.0';
  fechaRespuesta: Date;

  fechaActual!: Date;

  filtrarForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    fechaEntrega: new FormControl()
  });

  editarEstudianteForm = new FormGroup({
    idEstudiante: new FormControl(''),
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    respuesta: new FormControl(''),
    nota: new FormControl(0),
    fecha: new FormControl()
  });

  constructor(
    private estudianteService: EstudianteService,
    private toastrService: ToastrService,
    private dateFormat: DatePipe,
  ) {
    this.listaEstudiante = [];
    this.listaRespuesta = [];
    this.seleccionEditar = new Estudiante();
    this.seleccionRespuesta = new Respuesta();
    this.fechaRespuesta = new Date();
  }

  ngOnInit(): void {
    this.filtrar();
    this.fechaActual = new Date();
  }

  filtrar(): void {

    this.cargando = true;

    const nombre = this.filtrarForm.controls['nombre'].value;
    const fechaEntrega = this.filtrarForm.controls['fechaEntrega'].value;

    console.log(fechaEntrega);

    this.estudianteService.filtrarEstudiante(nombre ? nombre : null, fechaEntrega).subscribe(resp => {
      this.listaEstudiante = resp.data;
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
        this.cargando = false;
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
        this.cargando = false;
      }
    })
  }

  seleccionarEditar(estudiante: Estudiante) {
    this.seleccionEditar = estudiante;
    this.editarEstudianteForm.get('idEstudiante')?.disable();
    this.editarEstudianteForm.get('nota')?.disable();
    this.editarEstudianteForm.get('fecha')?.disable();
  }

  limpiar() {
    this.filtrarForm.get('nombre')?.value(null);
    this.filtrar();
  }

  seleccionarRespuesta() {
    const resp = this.editarEstudianteForm.get('respuesta')?.value;
    if (resp == '') {
      this.notaRespuesta = '0';
      this.fechaRespuesta = new Date();
    } else {
      this.notaRespuesta = this.seleccionEditar.respuestas[resp].nota;
      this.fechaRespuesta = this.seleccionEditar.respuestas[resp].fecha;
    }
  }

  borrarFecha(){
    this.filtrarForm.get('fechaEntrega')?.setValue(null);
  }
}
