import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Estudiante } from 'src/app/models/estudiante';
import { Respuesta } from 'src/app/models/respuesta';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { RespuestaService } from 'src/app/services/respuesta.service';

@Component({
  selector: 'app-respuesta',
  templateUrl: './respuesta.component.html',
  styleUrls: ['./respuesta.component.css']
})
export class RespuestaComponent implements OnInit {

  cargando = false;

  listaRespuestas: Respuesta[];
  listaEstudiantes: Estudiante[];

  fechaActual:Date = new Date();

  filtrarForm = new FormGroup({
    estudiantes: new FormControl(''),
    fecha: new FormControl(null)
  });

  constructor(
    private respuestaService: RespuestaService,
    private toastrService: ToastrService,
    private estudianteService: EstudianteService
  ) {
    this.listaRespuestas = [];
    this.listaEstudiantes = [];
   }

  ngOnInit(): void {
    this.filtrar(true);
  }

  filtrar(inicio?: boolean){

    this.cargando = true;

    const estudiante = this.filtrarForm.controls['estudiantes'].value;
    const fecha = this.filtrarForm.controls['fecha'].value;

    this.respuestaService.filtrarRespuesta(estudiante ? estudiante : null, fecha ? fecha : null).subscribe( resp => {
      this.listaRespuestas = resp.data;

      if(resp.success){
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 4000, closeButton: true });
        this.cargando = false;
        if(inicio){
          this.obtenerEstudiantes();
        }
      }else{
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
      this.cargando = false;
    });
  }

  obtenerEstudiantes(){
    this.cargando = true;

    this.estudianteService.obtenerEstudiantes().subscribe( resp => {
      this.listaEstudiantes = resp.data;

      if(resp.success){
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 4000, closeButton: true});
        this.cargando = false;
      }else{
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 4000, closeButton: true});
        this.cargando = false;
      }
    }, error => () => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 4000, closeButton: true});
      this.cargando = false;
    });
  }

  limpiar(){

  }

  borrarFecha(){

  }
}
