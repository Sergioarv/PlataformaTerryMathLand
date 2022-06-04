import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Estudiante } from 'src/app/models/estudiante';
import { EstudianteService } from 'src/app/services/estudiante.service';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {

  listaEstudiante: Estudiante[];

  regNumeros = '^[0-9]|[1-2][0-9]$';
  regTextoUnaLinea = '^[a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+';

  cargando = false;

  filtrarForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regTextoUnaLinea)])
  });

  constructor(
    private estudianteService: EstudianteService,
    private toastrService: ToastrService,
    private dateFormat: DatePipe,
  ) {
    this.listaEstudiante = [];
  }

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar(): void {

    this.cargando = true;

    const nombre = this.filtrarForm.controls['nombre'].value;

    this.estudianteService.filtrarEstudiante(nombre ? nombre : null).subscribe(resp => {
      this.listaEstudiante = resp.data;

      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
        this.cargando = false;
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
        this.cargando = false;
      }
    })
  }

  seleccionarEditar(estudiante: Estudiante){

  }

  filter(){

  }

  limpiar(){

  }
}
