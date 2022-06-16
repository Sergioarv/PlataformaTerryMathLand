import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  newCartilla: Cartilla;

  cargando = false;

  // Cartilla a la que se agregara o quitara preguntas
  seleccionarEditarCartilla: any;
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
    nomCartillaI: new FormControl('', [Validators.pattern(this.regTextoUnaLinea)]),
    preguntas: new FormControl(''),
    enumPregunta: new FormControl({ value: '', disabled: true }),
    opcionA: new FormControl({ value: '', disabled: true }),
    opcionB: new FormControl({ value: '', disabled: true }),
    opcionC: new FormControl({ value: '', disabled: true }),
    opcionD: new FormControl({ value: '', disabled: true }),
    urlImg: new FormControl({ value: '', disabled: true })
  });

  constructor(
    private toastrService: ToastrService,
    private cartillaService: CartillaService,
    private preguntaService: PreguntaService
  ) {
    this.listaCartillas = [];
    this.listaPreguntas = [];
    this.listaPreguntasCartilla = [];
    this.listaPreguntasAgregar = [];
    this.newCartilla = new Cartilla();
    this.creacionCartilla = false;
  }

  ngOnInit(): void {
    this.obtenerCartillas();
    this.obtenerPreguntas();
  }

  obtenerPreguntas() {
    this.preguntaService.obtenerPreguntas().subscribe(resp => {
      this.listaPreguntas = resp.data;
    });
  }

  obtenerCartillas() {
    this.cargando = true;
    this.cartillaService.obtenerCartillas().subscribe(resp => {
      this.listaCartillas = resp.data;

      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.filtrarForm.get('numcartilla')?.setValue(this.listaCartillas[0].idcartilla);
        this.filtrar(1);
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
  }

  filtrar(id?: any): void {

    this.cargando = true;

    const idCartilla = this.filtrarForm.controls['numcartilla'].value;

    if (idCartilla || id) {
      this.cartillaService.filtrarPreguntasCartilla(idCartilla ? idCartilla : id ? id : null).subscribe(resp => {
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

  seleccionarEditar(creacionB: boolean) {
    this.creacionCartilla = creacionB;
    const cartilla = this.filtrarForm.controls['numcartilla'].value;
    this.editarCartillaForm.get('nomCartilla')?.setValue(cartilla);
    this.editarCartillaForm.get('preguntas')?.setValue("");
    this.detalleDePregunta = null;

    this.listaPreguntasAgregar = this.listaPreguntasAgregar.concat(this.listaPreguntasCartilla);
  }

  detallesPregunta() {

    const i = this.editarCartillaForm.controls['preguntas'].value;
    this.detalleDePregunta = this.listaPreguntas[i];

    this.editarCartillaForm.get('enumPregunta')?.setValue(this.detalleDePregunta.enunciado);
    this.editarCartillaForm.get('opcionA')?.setValue(this.detalleDePregunta.opciones[0].enunciadoopcion);
    this.editarCartillaForm.get('opcionB')?.setValue(this.detalleDePregunta.opciones[1].enunciadoopcion);
    this.editarCartillaForm.get('opcionC')?.setValue(this.detalleDePregunta.opciones[2].enunciadoopcion);
    this.editarCartillaForm.get('opcionD')?.setValue(this.detalleDePregunta.opciones[3].enunciadoopcion);
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
      this.toastrService.warning('La pregunta ya no se agregara a la cartilla', 'Proceso fallido', { timeOut: 4000, closeButton: true });
    } else {
      this.toastrService.warning('La pregunta será borrada de la cartilla', 'Proceso fallido', { timeOut: 4000, closeButton: true });
    }

  }

  cerrarEditar() {
    this.listaPreguntasAgregar = [];
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
      const idCartilla = this.editarCartillaForm.controls['nomCartilla'].value;
      let cartilla = this.listaCartillas.find((c: any) => c.idcartilla = idCartilla);

      this.newCartilla.idcartilla = cartilla == undefined ? '' : cartilla.idcartilla;
      this.newCartilla.nombre = cartilla == undefined ? '' : cartilla.nombre;

      this.listaPreguntasAgregar.sort(function(a,b){
        if(a.idpregunta > b.idpregunta){ return 1;}
        if(a.idpregunta < b.idpregunta){ return -1;}
        return 0;
      });

      this.newCartilla.preguntas = this.listaPreguntasAgregar;

      this.cartillaService.actualizarCartilla(this.newCartilla).subscribe(resp => {
        if (resp.success) {
          this.toastrService.success(resp.message, 'Proceso exitoso');
          this.cargando = false;
          this.filtrar(1);
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
