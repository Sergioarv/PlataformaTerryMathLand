import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Pregunta } from 'src/app/models/pregunta';
import { PreguntaService } from 'src/app/services/pregunta.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarPreguntaComponent implements OnInit {

  regNumeros = '^[0-9]|[1-2][0-9]$';
  regTextoUnaLinea = '^[a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+';

  listPregunta: Pregunta[];

  cargando = false;

  editarPreguntasForm = new FormGroup({
    numePregunta: new FormControl({ value: '', disabled: true }, [Validators.pattern(this.regNumeros)]),
    enumPregunta: new FormControl('', [Validators.pattern(this.regTextoUnaLinea)]),
    opcionA: new FormControl('', [Validators.pattern(this.regTextoUnaLinea)]),
    opcionB: new FormControl('', [Validators.pattern(this.regTextoUnaLinea)]),
    opcionC: new FormControl('', [Validators.pattern(this.regTextoUnaLinea)]),
    opcionD: new FormControl('', [Validators.pattern(this.regTextoUnaLinea)]),
    urlImg: new FormControl({ value: '', disabled: true })
  });

  constructor(
    private preguntaService: PreguntaService,
    private toastrService: ToastrService,
  ) {
    this.listPregunta = []
  }

  ngOnInit(): void {
    this.obtenerPreguntas();
  }

  obtenerPreguntas() {
    this.cargando = true;
    this.preguntaService.obtenerPreguntas().subscribe(resp => {
      this.listPregunta = resp.data;

      if(resp.success){
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 5000, closeButton: true } );
        this.cargando = false;
      }else{
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true } );
        this.cargando = false;
      }
    });
  }

}
