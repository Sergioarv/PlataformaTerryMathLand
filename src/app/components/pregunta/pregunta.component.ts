import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pregunta } from 'src/app/models/pregunta';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { ToastrService } from 'ngx-toastr';
import { Opcion } from 'src/app/models/opcion';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css']
})
export class PreguntaComponent implements OnInit {

  listPregunta: Pregunta[];
  seleccionEditar: Pregunta;

  regNumeros = '^[0-9]|[1-2][0-9]$';
  regTextoUnaLinea = '^[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1].[a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1]$';

  cargando = false;

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
    urlImg: new FormControl({value: '', disabled: true})
  });

  crearPreguntaForm = new FormGroup({
    numePregunta: new FormControl(''),
    enumPregunta: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(255)]),
    opcionA: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    opcionB: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    opcionC: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    opcionD: new FormControl('', [Validators.pattern(this.regTextoUnaLinea), Validators.maxLength(80)]),
    urlImg: new FormControl({value: '', disabled: true})
  });

  constructor(
    private preguntaService: PreguntaService,
    private toastrService: ToastrService,
  ) {
    this.listPregunta = [];
    this.seleccionEditar = new Pregunta();
    this.seleccionEditar.opciones[0] = new Opcion();
    this.seleccionEditar.opciones[1] = new Opcion();
    this.seleccionEditar.opciones[2] = new Opcion();
    this.seleccionEditar.opciones[3] = new Opcion();
  }

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar(): void {

    const idPregunta = this.filtrarForm.controls['numPregunta'].value;
    const enunciado = this.filtrarForm.controls['enunciado'].value;

    this.cargando = true;

    this.preguntaService.filtrarPregunta(idPregunta ? idPregunta : null, enunciado ? enunciado : null).subscribe(resp => {
      this.listPregunta = resp.data;
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 5000, closeButton: true });
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
      }
      this.cargando = false;
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

  crearPregunta(){

  }

  guardarPregunta(){
    console.log(this.editarPreguntaForm.controls['enumPregunta'].value);
  }

  seleccionarEditar(pregunta: Pregunta){
    this.editarPreguntaForm.get('numePregunta')?.disable();
    this.editarPreguntaForm.get('numePregunta')?.setValue(pregunta.idpregunta);
    this.editarPreguntaForm.get('enumPregunta')?.setValue(pregunta.enunciado);
    this.editarPreguntaForm.get('opcionA')?.setValue(pregunta.opciones[0].enunciadoopcion);
    this.editarPreguntaForm.get('opcionB')?.setValue(pregunta.opciones[1].enunciadoopcion);
    this.editarPreguntaForm.get('opcionC')?.setValue(pregunta.opciones[2].enunciadoopcion);
    this.editarPreguntaForm.get('opcionD')?.setValue(pregunta.opciones[3].enunciadoopcion);
    this.seleccionEditar = pregunta;
  }

  resetearcrearPreguntaForm(){
    
  }
}
