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
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 4000, closeButton: true });
        this.filtrarForm.get('numcartilla')?.setValue(this.listaCartillas[0].idcartilla);
        this.filtrar(1);
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
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

  seleccionarEditar() {
    const cartilla = this.filtrarForm.controls['numcartilla'].value;
    this.editarCartillaForm.get('nomCartilla')?.setValue(cartilla);

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
      this.toastrService.info('La cantidad maxima (25 preguntas por cartilla) se ha cumplido', 'Proceso pendiente', { timeOut: 4000, closeButton: true });
    } else {
      const verificar = this.listaPreguntasAgregar.filter((preg: Pregunta) =>
        preg.idpregunta == preguntaAdd.idpregunta);

      if (verificar.length == 0) {
        this.listaPreguntasAgregar.push(preguntaAdd);
        this.toastrService.info('La pregunta se encuentra en la lista para ser guardada', 'Proceso exitoso', { timeOut: 4000, closeButton: true });
      } else {
        this.toastrService.warning('La pregunta ya ha sido agregada', 'Proceso fallido', { timeOut: 4000, closeButton: true });
      }
    }
  }

  quitarPregunta(preguntaC: any){
    const indice = this.listaPreguntasAgregar.indexOf(preguntaC);
    this.listaPreguntasAgregar.splice(indice, 1);
  }

  cerrarEditar(){
    this.listaPreguntasAgregar = [];
  }

  guardarCartilla() {
    if(this.listaPreguntasAgregar.length < 5){
      this.toastrService.info('La capacidad maxima (25 preguntas por cartilla) se ha cumplido', 'Proceso exitoso', { timeOut: 4000, closeButton: true });
    }
  }
}
