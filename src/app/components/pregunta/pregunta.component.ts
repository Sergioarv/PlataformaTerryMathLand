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

  filterForm = new FormGroup({
    numPregunta: new FormControl(),
    enunciado: new FormControl()
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

  filter(idPregunta?: any, enunciado?: any): void {
this.cargando = true;
      this.preguntaService.filtrarPregunta(idPregunta ? idPregunta : null, enunciado ? enunciado : null).subscribe(resp => {
        this.listPregunta = resp.data;
        if(resp.success){
          this.toastrService.success(resp.message,'Proceso exitoso', { timeOut: 2000, closeButton: true});
        }else{
          this.toastrService.error(resp.message,'Proceso fallido', { timeOut: 2000, closeButton: true});
        }
        this.cargando = false;
      });
  }

  limpiar(): void {

    this.filterForm.get('ruta')?.setValue("");
    this.filterForm.get('conector')?.setValue("");
    this.filterForm.get('fecha')?.setValue(null);
  }

}
