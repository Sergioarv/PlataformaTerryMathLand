import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cartilla } from 'src/app/models/cartilla';
import { Pregunta } from 'src/app/models/pregunta';
import { CartillaService } from 'src/app/services/cartilla.service';
import { PreguntaService } from 'src/app/services/pregunta.service';

@Component({
  selector: 'app-cartilla',
  templateUrl: './cartilla.component.html',
  styleUrls: ['./cartilla.component.css']
})
export class CartillaComponent implements OnInit {

  // Lista de Cartillas
  listaCartillas: Cartilla[];
  // Lista de preguntas disponibles a agregar
  listaPreguntas: Pregunta[];
  // Preguntas de la cartilla seleccionada
  listaPreguntasCartilla: Pregunta[];
  // Lista de preguntas a actualizar en la cartilla
  listaPreguntasAgregar: Pregunta[];
  // Boleano para crear una nueva cartilla
  creacionCartilla: boolean;
  // cartilla a guardar o editada
  mensajeEliminar = '';

  cargando = false;

  closeResult = '';

  // Pregunta seleccionada para agregar
  detalleDePregunta: any;

  regNumeros = '^[0-9]|[1-2][0-9]$';
  regTextoUnaLinea = '^[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1].[a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1]$';

  filtrarForm = new FormGroup({
    numcartilla: new FormControl(''),
    enunciado: new FormControl(''),
  });

  editarCartillaForm = new FormGroup({
    nomCartilla: new FormControl({ value: '', disabled: true }),
    nomCartillaI: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.required]),
    preguntas: new FormControl(''),
  });

  constructor(
    private toastrService: ToastrService,
    private cartillaService: CartillaService,
    private preguntaService: PreguntaService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.listaCartillas = [];
    this.listaPreguntas = [];
    this.listaPreguntasCartilla = [];
    this.listaPreguntasAgregar = [];
    this.creacionCartilla = false;

    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.obtenerCartillas();
    this.obtenerPreguntas();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  obtenerPreguntas() {
    this.preguntaService.obtenerPreguntas().subscribe(resp => {
      this.listaPreguntas = resp.data;
    });
  }

  obtenerCartillas() {
    this.cargando = true;
    this.listaPreguntasCartilla = [];
    this.cartillaService.obtenerCartillas().subscribe(resp => {
      this.listaCartillas = resp.data;

      if (resp.success) {
        this.listaCartillas.sort(function (a, b) {
          if (a.nombre > b.nombre) { return 1; }
          if (a.nombre < b.nombre) { return -1; }
          return 0;
        });
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

  filtrar(): void {

    this.cargando = true;
    const cartillaF = this.filtrarForm.controls['numcartilla'].value;

    if (cartillaF != null && cartillaF != '') {

      this.cartillaService.filtrarPreguntasCartilla(cartillaF ? cartillaF : null).subscribe(resp => {
        this.listaPreguntasCartilla = resp.data;
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
    } else {
      this.listaPreguntasCartilla = [];
      this.cargando = false;
    }
  }

  limpiar(): void {
    this.filtrarForm.get('numcartilla')?.setValue("");
    this.filtrarForm.get('enunciado')?.setValue("");
    this.filtrar();
  }

  seleccionarEditar(creacionB: boolean, content?: any) {
    this.creacionCartilla = creacionB;
    const seleccionarEditarCartilla = this.filtrarForm.controls['numcartilla'].value;
    this.editarCartillaForm.get('nomCartilla')?.setValue(seleccionarEditarCartilla);
    this.editarCartillaForm.get('nomCartillaI')?.setValue(creacionB ? "" : "nada");

    if (!creacionB) {
      this.listaPreguntasAgregar = this.listaPreguntasAgregar.concat(this.listaPreguntasCartilla);
    }

    this.open(content, 'xl');
  }

  seleccionarEliminar(contentEliminar?: any) {
    const seleccionarEliminarCartilla = this.filtrarForm.controls['numcartilla'].value;
    const cartillaE = this.listaCartillas.find((cart: Cartilla) => 
    cart.idcartilla == seleccionarEliminarCartilla);
    this.mensajeEliminar = cartillaE?.nombre == undefined ? '' : cartillaE?.nombre;
    this.open(contentEliminar, '');
  }

  detallesPregunta() {
    const i = this.editarCartillaForm.controls['preguntas'].value;
    this.detalleDePregunta = this.listaPreguntas[i];
  }

  agregarPregunta() {
    const i = this.editarCartillaForm.controls['preguntas'].value;
    const preguntaAdd = this.listaPreguntas[i];

    if (this.listaPreguntasAgregar.length == 25) {
      this.toastrService.info('La cantidad maxima (25 preguntas por cartilla) se ha cumplido, no se pueden agregar más preguntas', 'Proceso pendiente');
    } else {
      const verificar = this.listaPreguntasAgregar.find((preg: Pregunta) =>
        preg.idpregunta == preguntaAdd.idpregunta);

      if (verificar == null) {
        this.listaPreguntasAgregar.push(preguntaAdd);
        this.toastrService.info('La pregunta se encuentra en la lista para ser guardada', 'Proceso pendiente');

        this.listaPreguntasAgregar.sort(function (a, b) {
          if (a.idpregunta > b.idpregunta) { return 1; }
          if (a.idpregunta < b.idpregunta) { return -1; }
          return 0;
        });
      } else {
        this.toastrService.warning('La pregunta ya ha sido agregada', 'Proceso fallido');
      }
    }
  }

  quitarPregunta(preguntaC: any) {
    const indice = this.listaPreguntasAgregar.indexOf(preguntaC);
    this.listaPreguntasAgregar.splice(indice, 1);

    const verificar = this.listaPreguntasCartilla.find((preg: Pregunta) =>
      preg.idpregunta == preguntaC.idpregunta);

    if (verificar == null) {
      this.toastrService.warning('La pregunta ya no se agregara a la cartilla', 'Proceso fallido');
    } else {
      this.toastrService.warning('La pregunta será borrada de la cartilla', 'Proceso fallido');
    }
  }

  cerrarEditar() {
    this.listaPreguntasAgregar = [];
    this.editarCartillaForm.get('nomCartilla')?.setValue("");
    this.editarCartillaForm.get('nomCartillaI')?.setValue("");
    this.editarCartillaForm.get('preguntas')?.setValue("");
    this.detalleDePregunta = null;
    this.modalService.dismissAll('Close click');
  }

  abrirConfirmarEdit(contentCancelarEditar?: any) {
    this.creacionCartilla ? this.cerrarEditar() : this.open(contentCancelarEditar, '');
  }

  guardarCartilla() {
    this.cargando = true;

    if (this.listaPreguntasAgregar.length < 5) {
      this.toastrService.info('La capacidad minima (5 preguntas por cartilla) no se ha cumplido, por favor agrega más preguntas', 'Proceso exitoso', { timeOut: 4000, closeButton: true });
      this.cargando = false;
    } else if (this.listaPreguntasAgregar.length >= 25) {
      this.toastrService.info('La cantidad maxima (25 preguntas por cartilla) se ha cumplido, quite algunas preguntas', 'Proceso pendiente');
      this.cargando = false;
    } else {

      const newCartilla = new Cartilla();

      if (this.creacionCartilla) {
        const nombreCartilla = this.editarCartillaForm.controls['nomCartillaI'].value;
        newCartilla.idcartilla = '-1';
        newCartilla.nombre = nombreCartilla;
        newCartilla.preguntas = this.listaPreguntasAgregar;

        this.cartillaService.crearCartilla(newCartilla).subscribe(resp => {
          if (resp.success) {
            this.toastrService.success(resp.message, 'Proceso exitoso');
            this.cargando = false;
            this.obtenerCartillas();
            this.limpiar();
            this.cerrarEditar();
          } else {
            this.toastrService.error(resp.message, 'Proceso fallido');
            this.cargando = false;
          }
        }, error => {
          this.toastrService.error(error.message, 'Proceso fallido');
          this.cargando = false;
        });

      } else {
        const cartillaU = this.editarCartillaForm.controls['nomCartilla'].value;
        let cartilla = this.listaCartillas.find((c: any) => c.idcartilla == cartillaU);

        newCartilla.idcartilla = cartilla == undefined ? '' : cartilla.idcartilla;
        newCartilla.nombre = cartilla == undefined ? '' : cartilla.nombre;

        newCartilla.preguntas = this.listaPreguntasAgregar;

        this.cartillaService.actualizarCartilla(newCartilla).subscribe(resp => {
          if (resp.success) {
            this.toastrService.success(resp.message, 'Proceso exitoso');
            this.cargando = false;
            this.filtrar();
            this.cerrarEditar();
          } else {
            this.toastrService.error(resp.message, 'Proceso fallido');
            this.cargando = false;
          }
        }, error => {
          this.toastrService.error(error.message, 'Proceso fallido');
          this.cargando = false;
        });
      }
    }
  }

  eliminarCartilla() {
    
    this.cargando = true;

    const cartillaD = this.filtrarForm.controls['numcartilla'].value;
    let cartilla = this.listaCartillas.find((c: any) => c.idcartilla == cartillaD);

    const eliminar = new Cartilla();

    eliminar.idcartilla = cartilla == undefined ? '' : cartilla?.idcartilla;
    eliminar.nombre = cartilla == undefined ? '' : cartilla.nombre;
    eliminar.preguntas = cartilla == undefined ? [] : cartilla?.preguntas;

    this.cartillaService.eliminarCartilla(eliminar).subscribe(resp => {
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.limpiar();
        this.obtenerCartillas();
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
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
