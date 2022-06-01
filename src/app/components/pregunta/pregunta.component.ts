import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pregunta } from 'src/app/models/pregunta';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css']
})
export class PreguntaComponent implements OnInit {

  listPregunta: Pregunta[];

  public cargando = false;

  filtrarForm = new FormGroup({
    numPregunta: new FormControl('', [Validators.pattern('^[0-9]|[1-2][0-9]$')]),
    enunciado: new FormControl(),
  });

  constructor(
    private preguntaService: PreguntaService,
    private toastrService: ToastrService,
  ) {
    this.listPregunta = [];
  }

  ngOnInit(): void {
    this.filter();
  }

  filter(): void {

    console.log(this.filtrarForm.valid);

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
  }

}
