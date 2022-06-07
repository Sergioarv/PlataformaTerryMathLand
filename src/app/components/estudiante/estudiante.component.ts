import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
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
  seleccionEliminar: Estudiante;
  seleccionRespuesta: Respuesta;
  notaRespuesta: string = '0.0';
  fechaRespuesta: Date;

  fechaActual!: Date;

  closeResult = '';

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

  agregarEstudianteForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
  });

  eliminarEstudianteForm = new FormGroup({
    idEstudiante: new FormControl(''),
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
  });

  constructor(
    private estudianteService: EstudianteService,
    private toastrService: ToastrService,
    private dateFormat: DatePipe,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    this.listaEstudiante = [];
    this.listaRespuesta = [];
    this.seleccionEditar = new Estudiante();
    this.seleccionEliminar = new Estudiante();
    this.seleccionRespuesta = new Respuesta();
    this.fechaRespuesta = new Date();

    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.filtrar();
    this.fechaActual = new Date();
  }

  filtrar(): void {

    this.cargando = true;

    const nombre = this.filtrarForm.controls['nombre'].value;
    const fechaEntrega = this.filtrarForm.controls['fechaEntrega'].value;

    this.estudianteService.filtrarEstudiante(nombre ? nombre : null, fechaEntrega).subscribe(resp => {
      this.listaEstudiante = resp.data;
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 4000, closeButton: true });
        this.cargando = false;
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
      this.cargando = false;
    });
  }

  agregarEstudiante() {

    this.cargando = true;

    const newEstudiante = new Estudiante();
    newEstudiante.nombre = this.agregarEstudianteForm.controls['nombre'].value;
    newEstudiante.idusuario = '-1';

    this.estudianteService.agregar(newEstudiante).subscribe(resp => {
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 4000, closeButton: true });
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.filtrar();
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
      this.cargando = false;
    });
  }

  editarEstudiante(){

    this.cargando = true;
    const actualizarEst = new Estudiante();

    actualizarEst.idusuario = this.editarEstudianteForm.controls['idEstudiante'].value;
    actualizarEst.nombre = this.editarEstudianteForm.controls['nombre'].value;

    this.estudianteService.actualizar(actualizarEst).subscribe( resp => {
      if(resp.success){
        this.toastrService.success(resp.message, 'Proceso exitoso', {timeOut: 4000, closeButton: true});
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.filtrar();
      }else{
        this.toastrService.error(resp.message, 'Proceso fallido', {timeOut: 4000, closeButton: true});
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido', {timeOut: 4000, closeButton: true});
      this.cargando = false;
    });
  }

  eliminarEstudiante(estudiante: any){

    this.cargando = true;

    this.estudianteService.eliminar(estudiante).subscribe( resp => {
      if(resp.success){
        this.toastrService.success(resp.message, 'Ptoceso exitoso', {timeOut: 4000, closeButton: true});
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.filtrar();
      }else{
        this.toastrService.error(resp.message, 'Ptoceso fallido', {timeOut: 4000, closeButton: true});
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Ptoceso exitoso', {timeOut: 4000, closeButton: true});
      this.cargando = false;
    });
  }

  seleccionarEditar(estudiante: Estudiante, contentEdit?: any) {
    this.seleccionEditar = estudiante;
    this.editarEstudianteForm.get('idEstudiante')?.disable();
    this.editarEstudianteForm.get('nota')?.disable();
    this.editarEstudianteForm.get('fecha')?.disable();

    this.editarEstudianteForm.get('idEstudiante')?.setValue(this.seleccionEditar.idusuario);
    this.editarEstudianteForm.get('nombre')?.setValue(this.seleccionEditar.nombre);

    this.open(contentEdit);
  }

  seleccionarEliminar(estudiante: Estudiante, contentEliminar?: any) {
    this.seleccionEliminar = estudiante;
    this.eliminarEstudianteForm.get('idEstudiante')?.disable();
    this.eliminarEstudianteForm.get('nombre')?.disable();

    this.eliminarEstudianteForm.get('idEstudiante')?.setValue(this.seleccionEliminar.idusuario);
    this.eliminarEstudianteForm.get('nombre')?.setValue(this.seleccionEliminar.nombre);

    this.open(contentEliminar);
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

  borrarFecha() {
    this.filtrarForm.get('fechaEntrega')?.setValue(null);
  }

  limpiar(): void {
    console.log("limpiando");
    this.filtrarForm.get('nombre')?.setValue('');
    this.filtrarForm.get('fechaEntrega')?.value(null);
    this.filtrar();
  }

  open(content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdropClass: 'light-blue-backdrop' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    },  (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  resetearFiltrarForm(){
    this.filtrarForm.get('nombre')?.setValue('');
    this.filtrarForm.get('fechaEntrega')?.setValue(null);
  }

  resetearEditarEstudianteForm(){
    this.editarEstudianteForm.get('idEstudiante')?.setValue('');
    this.editarEstudianteForm.get('nombre')?.setValue('');
    this.editarEstudianteForm.get('respuesta')?.setValue('');
    this.editarEstudianteForm.get('nota')?.setValue('0');
    this.editarEstudianteForm.get('fecha')?.setValue(null);
    this.seleccionEditar = new Estudiante();
    this.notaRespuesta = '0';
    this.fechaRespuesta = new Date();
    this.seleccionEditar = new Estudiante();
    this.modalService.dismissAll('Close click');
  }

  resetearAgregarEstudianteForm(){
    this.agregarEstudianteForm.get('nombre')?.setValue('');
    this.modalService.dismissAll('Close click');
  }

  resetearEliminarEstudianteForm(){
    this.agregarEstudianteForm.get('idEstudiante')?.setValue('');
    this.agregarEstudianteForm.get('nombre')?.setValue('');
    this.modalService.dismissAll('Close click');
  }

}