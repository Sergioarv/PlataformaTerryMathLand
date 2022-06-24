import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pregunta } from 'src/app/models/pregunta';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Opcion } from 'src/app/models/opcion';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css'],
})
export class PreguntaComponent implements OnInit {

  listPregunta: Pregunta[];

  imagen: any = null;
  imagenMin: any;
  imagenPregunta: any;

  regNumeros = '[0-9]+';
  regNombre = '^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ]$';
  regTextoUnaLinea = '^[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1].[a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1]$';

  cargando = false;

  opcionCheck: string[] = ["", "", "", ""];
  opcionList: string[] = ["opcionA", "opcionB", "opcionC", "opcionD"];

  closeResult = '';

  preguntaEliminar: Pregunta = new Pregunta();

  filtrarForm = new FormGroup({
    numPregunta: new FormControl('', [Validators.pattern(this.regNumeros)]),
    enunciado: new FormControl(''),
  });

  editarPreguntaForm = new FormGroup({
    numePregunta: new FormControl(''),
    enumPregunta: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(255)]),
    opcionA: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    opcionB: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    opcionC: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    opcionD: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
  });

  crearPreguntaForm = new FormGroup({
    enumPregunta: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(255)]),
    opcionA: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    opcionB: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    opcionC: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    opcionD: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
  });

  constructor(
    private preguntaService: PreguntaService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.listPregunta = [];
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar(): void {

    this.cargando = true;

    const idPregunta = this.filtrarForm.controls['numPregunta'].value;
    const enunciado = this.filtrarForm.controls['enunciado'].value;

    this.preguntaService.filtrarPregunta(idPregunta ? idPregunta : null, enunciado ? enunciado : null).subscribe(resp => {
      this.listPregunta = resp.data;
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 5000, closeButton: true });
        this.cargando = false;
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
      this.cargando = false;
    });
  }

  limpiar(): void {
    this.filtrarForm.get('numPregunta')?.setValue("");
    this.filtrarForm.get('enunciado')?.setValue("");
    this.filtrar();
  }

  crearPregunta() {

    this.cargando = true;

    const preguntaCrear = new Pregunta();
    const opciones: Opcion[] = [];

    preguntaCrear.enunciado = this.crearPreguntaForm.controls['enumPregunta'].value;

    for (let i = 0; i < 4; i++) {
      const opcion = new Opcion();
      opcion.enunciadoopcion = this.crearPreguntaForm.controls[this.opcionList[i]].value;
      opcion.respuesta = this.opcionCheck[i] == "checked" ? true : false;
      preguntaCrear.opciones.push(opcion);
    }

    this.preguntaService.crearPregunta(this.imagen, preguntaCrear).subscribe(resp => {
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.resetearcrearPreguntaForm();
        this.modalService.dismissAll('Save click');
        this.cargando = false;
        this.filtrar();
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso exitoso');
      this.cargando = false;
    });
  }

  guardarPregunta() {

    this.cargando = true;

    const idPregunta = this.editarPreguntaForm.controls['numePregunta'].value;

    const seleccionEditar = this.listPregunta.find((pregunta: Pregunta) =>
      pregunta.idpregunta == idPregunta);

    const preguntaEditada = new Pregunta();

    preguntaEditada.idpregunta = idPregunta;
    preguntaEditada.enunciado = this.editarPreguntaForm.controls['enumPregunta'].value;
    preguntaEditada.opciones = seleccionEditar == undefined ? [] : seleccionEditar?.opciones;
    preguntaEditada.urlImg = seleccionEditar == undefined ? '' : seleccionEditar?.urlImg;
    preguntaEditada.idImg = seleccionEditar == undefined ? '' : seleccionEditar?.idImg;
    preguntaEditada.nombreImg = seleccionEditar == undefined ? '' : seleccionEditar?.nombreImg;

    let index = this.listPregunta.findIndex((element: Pregunta) => element.idpregunta == idPregunta);

    for (let i = 0; i < this.listPregunta[index].opciones.length; i++) {
      preguntaEditada.opciones[i].enunciadoopcion = this.editarPreguntaForm.controls[this.opcionList[i]].value;
      preguntaEditada.opciones[i].respuesta = this.opcionCheck[i] == "checked" ? true : false;
    }

    if (this.imagenPregunta == '') {
      preguntaEditada.urlImg = '';
    }

    this.preguntaService.editarPregunta(this.imagen, preguntaEditada).subscribe(resp => {
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
      this.toastrService.error(error.message, 'Proceso exitoso');
      this.cargando = false;
    });
  }

  seleccionarEditar(pregunta: Pregunta, contentEdit?: any) {

    const preguntaSelect = pregunta;

    this.editarPreguntaForm.get('numePregunta')?.disable();
    this.editarPreguntaForm.get('numePregunta')?.setValue(preguntaSelect.idpregunta);
    this.editarPreguntaForm.get('enumPregunta')?.setValue(preguntaSelect.enunciado);
    this.imagenPregunta = preguntaSelect.urlImg;

    for (let i = 0; i < preguntaSelect.opciones.length; i++) {
      const element = preguntaSelect.opciones[i];

      this.editarPreguntaForm.get(this.opcionList[i])?.setValue(element.enunciadoopcion);
      this.opcionCheck[i] = element.respuesta ? "checked" : "";
    }
    this.open(contentEdit, 'xl');
  }

  seleccionarEliminar(pregunta: any, contentEliminar?: any) {

    this.preguntaEliminar = pregunta;
    this.open(contentEliminar, '');
  }

  seleccionarImagen(event: any): any {
    this.cargando = true;
    if (event.target.files && event.target.files[0]) {
      this.imagen = event.target.files[0];
      const fr = new FileReader();
      fr.onload = (evento: any) => {
        this.imagenMin = evento.target.result;
        this.cargando = false;
      };
      fr.readAsDataURL(this.imagen);
    } else {
      this.resetearImagenSeleccionada();
      this.cargando = false;
    }
  }

  quitarImagen() {
    this.imagenPregunta = "";
    this.resetearImagenSeleccionada();
  }

  resetearImagenSeleccionada() {
    this.imagen = null;
    this.imagenMin = null;
  }

  resetearcrearPreguntaForm() {
    this.crearPreguntaForm.get('enumPregunta')?.setValue("");
    this.crearPreguntaForm.get('opcionA')?.setValue("");
    this.crearPreguntaForm.get('opcionB')?.setValue("");
    this.crearPreguntaForm.get('opcionC')?.setValue("");
    this.crearPreguntaForm.get('opcionD')?.setValue("");
    this.opcionCheck = ["", "", "", ""];
    this.resetearImagenSeleccionada();
    this.modalService.dismissAll('Close click')
  }

  resetearEditarPreguntaForm() {
    this.resetearImagenSeleccionada();
    this.editarPreguntaForm.reset();
    this.opcionCheck = ["", "", "", ""];
    this.modalService.dismissAll('Close click');
  }

  seleccionarCheck(index: any) {
    for (let i = 0; i < this.opcionCheck.length; i++) {
      this.opcionCheck[i] = i == index ? "checked" : "";
    }
  }

  eliminarPregunta() {
    this.cargando = true;

    this.preguntaService.eliminarPregunta(this.preguntaEliminar).subscribe( resp => {
      if(resp.success){
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
        this.filtrar();
      }else{
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
  }

  verificarCheck(): boolean {

    let verificar = false;

    for (const item of this.opcionCheck) {
      if (item == 'checked') {
        verificar = true;
        return verificar;
      }
    }
    return verificar;
  }

  /** Funciones para abrir y cerrar modal ng **/
  open(content: any, tamaño: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: tamaño, backdropClass: 'light-blue-backdrop', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
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
}