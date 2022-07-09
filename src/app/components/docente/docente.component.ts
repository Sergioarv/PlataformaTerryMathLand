import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Docente } from 'src/app/models/docente';
import { DocenteService } from 'src/app/services/docente.service';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css']
})
export class DocenteComponent implements OnInit {

  listaDocente: Docente[];

  regNumeros = '[0-9]+';
  regTextoUnaLinea = '^[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1].[a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1]$';
  regNombre = '^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ]$';
  regCorreo = '^[a-z][a-z0-9._%+-]+@[a-z0-9.-]+[\.]([a-z]){2,3}$';

  cargando = false;

  seleccionEditar: Docente;
  seleccionEliminar: Docente;

  closeResult = '';

  filtrarForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    correo: new FormControl('', [Validators.pattern(this.regCorreo)])
  });

  editarDocenteForm = new FormGroup({
    idDocente: new FormControl(''),
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    documento: new FormControl('', Validators.pattern(this.regNumeros)),
    correo: new FormControl('', [Validators.pattern(this.regCorreo)])
  });

  agregarDocenteForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    documento: new FormControl('', [Validators.pattern(this.regNumeros)]),
    correo: new FormControl('')
  });

  eliminarDocenteForm = new FormGroup({
    idDocente: new FormControl(''),
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    documento: new FormControl('', [Validators.pattern(this.regNumeros)]),
    correo: new FormControl('')
  });

  constructor(
    private docenteService: DocenteService,
    private toastrService: ToastrService,
    private route: Router,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    this.listaDocente = [];
    this.seleccionEditar = new Docente();
    this.seleccionEliminar = new Docente();

    config.backdrop = 'static';
    config.keyboard = false;
   }

  ngOnInit(): void {
  }

  filtrar(): void {

    this.cargando = true;

    const nombre = this.filtrarForm.controls['nombre'].value;
    const correo = this.filtrarForm.controls['correo'].value;

    this.docenteService.filtrarDocente(nombre ? nombre : null, correo).subscribe(resp => {
      this.listaDocente = resp.data;
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
  }

  agregarDocente() {

    this.cargando = true;

    const newDocente = new Docente();
    newDocente.nombre = this.agregarDocenteForm.controls['nombre'].value;
    newDocente.documento = this.agregarDocenteForm.controls['documento'].value;
    newDocente.contrasenia = this.agregarDocenteForm.controls['documento'].value;
    newDocente.correo = this.agregarDocenteForm.controls['correo'].value;
    newDocente.idusuario = '-1';

    this.docenteService.agregar(newDocente).subscribe(resp => {
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.filtrar();
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
  }

  editarDocente(){

    this.cargando = true;
    const actualizarDoc = new Docente();

    actualizarDoc.idusuario = this.editarDocenteForm.controls['idDocente'].value;
    actualizarDoc.nombre = this.editarDocenteForm.controls['nombre'].value;
    actualizarDoc.documento = this.editarDocenteForm.controls['documento'].value;
    actualizarDoc.contrasenia = this.editarDocenteForm.controls['documento'].value;
    actualizarDoc.correo = this.editarDocenteForm.controls['correo'].value;
    actualizarDoc.roles = this.seleccionEditar.roles;

    this.docenteService.actualizar(actualizarDoc).subscribe( (resp:any) => {
      if(resp.success){
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.filtrar();
      }else{
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    },
    (error: any) => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
  }

  eliminarDocente(docente: any){

    this.cargando = true;

    this.docenteService.eliminar(docente).subscribe( resp => {
      if(resp.success){
        this.toastrService.success(resp.message, 'Ptoceso exitoso');
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.filtrar();
      }else{
        this.toastrService.error(resp.message, 'Ptoceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Ptoceso exitoso');
      this.cargando = false;
    });
  }

  seleccionarEditar(docente: Docente, contentEdit?: any) {
    this.seleccionEditar = docente;
    this.editarDocenteForm.get('idDocente')?.disable();

    this.editarDocenteForm.get('idDocente')?.setValue(this.seleccionEditar.idusuario);
    this.editarDocenteForm.get('nombre')?.setValue(this.seleccionEditar.nombre);
    this.editarDocenteForm.get('documento')?.setValue(this.seleccionEditar.documento);
    this.editarDocenteForm.get('correo')?.setValue(this.seleccionEditar.correo);

    this.open(contentEdit);
  }

  seleccionarEliminar(docente: Docente, contentEliminar?: any) {
    this.seleccionEliminar = docente;
    this.eliminarDocenteForm.get('idDocente')?.disable();
    this.eliminarDocenteForm.get('nombre')?.disable();
    this.eliminarDocenteForm.get('documento')?.disable();
    this.eliminarDocenteForm.get('correo')?.disable();

    this.eliminarDocenteForm.get('idDocente')?.setValue(this.seleccionEliminar.idusuario);
    this.eliminarDocenteForm.get('nombre')?.setValue(this.seleccionEliminar.nombre);
    this.eliminarDocenteForm.get('documento')?.setValue(this.seleccionEliminar.idusuario);
    this.eliminarDocenteForm.get('correo')?.setValue(this.seleccionEliminar.nombre);

    this.open(contentEliminar);
  }

  limpiar(): void {
    this.filtrarForm.get('nombre')?.setValue('');
    this.filtrarForm.get('correo')?.setValue('');
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
    this.filtrarForm.get('correo')?.setValue('');
  }

  resetearEditarDocenteForm(){
    this.editarDocenteForm.get('idDocente')?.setValue('');
    this.editarDocenteForm.get('nombre')?.setValue('');
    this.editarDocenteForm.get('documento')?.setValue('');
    this.editarDocenteForm.get('correo')?.setValue('');
    this.seleccionEditar = new Docente();
    this.modalService.dismissAll('Close click');
  }

  resetearAgregarDocenteForm(){
    this.agregarDocenteForm.get('nombre')?.setValue('');
    this.agregarDocenteForm.get('documento')?.setValue('');
    this.agregarDocenteForm.get('correo')?.setValue('');
    this.modalService.dismissAll('Close click');
  }

  resetearEliminarDocenteForm(){
    this.eliminarDocenteForm.get('idDocente')?.setValue('');
    this.eliminarDocenteForm.get('nombre')?.setValue('');
    this.eliminarDocenteForm.get('documento')?.setValue('');
    this.eliminarDocenteForm.get('correo')?.setValue('');
    this.modalService.dismissAll('Close click');
  }
}
