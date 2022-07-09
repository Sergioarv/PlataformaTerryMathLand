import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Estudiante } from 'src/app/models/estudiante';
import { Respuesta } from 'src/app/models/respuesta';
import { Solucion } from 'src/app/models/solucion';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { RespuestaService } from 'src/app/services/respuesta.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-respuesta',
  templateUrl: './respuesta.component.html',
  styleUrls: ['./respuesta.component.css']
})
export class RespuestaComponent implements OnInit {

  cargando = false;

  listaRespuestas: Respuesta[];
  listaEstudiantes: Estudiante[];
  listaSoluciones: Solucion[];

  seleccionRespuesta: Respuesta;

  fechaActual: Date = new Date();

  closeResult = '';

  roles: string[];
  authority: string;

  filtrarForm = new FormGroup({
    estudiantes: new FormControl(''),
    fecha: new FormControl(null)
  });

  constructor(
    private respuestaService: RespuestaService,
    private toastrService: ToastrService,
    private estudianteService: EstudianteService,
    private tokenService: TokenService,
    private modalService: NgbModal,
    private config: NgbModalConfig
  ) {
    this.listaRespuestas = [];
    this.listaEstudiantes = [];
    this.listaSoluciones = [];

    this.seleccionRespuesta = new Respuesta();

    this.roles = [];
    this.authority = '';

    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.authority = this.tokenService.getRoles();
    if (this.authority === 'estudiante')
      this.filtrarForm.get('estudiantes')?.disable();
    this.filtrar(true);
  }

  verificarEstudianteId() {
    const idEstudiante = localStorage.getItem('idEstudiante');
    if (idEstudiante != null) {
      this.filtrarForm.get('estudiantes')?.setValue(idEstudiante);

      this.respuestaService.filtrarRespuesta(idEstudiante, null).subscribe(resp => {
        this.listaRespuestas = resp.data;

        localStorage.removeItem('idEstudiante');
      });

    }
  }

  filtrar(inicio?: boolean) {

    this.cargando = true;

    const estudiante = this.filtrarForm.controls['estudiantes'].value;
    const fecha = this.filtrarForm.controls['fecha'].value;

    this.respuestaService.filtrarRespuesta(estudiante ? estudiante : null, fecha ? fecha : null).subscribe(resp => {
      this.listaRespuestas = resp.data;

      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 4000, closeButton: true });
        this.cargando = false;
        if (inicio) {
          this.obtenerEstudiantes();
        }
      } else {
        this.toastrService.warning(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
      this.cargando = false;
    });
  }

  obtenerEstudiantes() {
    this.cargando = true;

    this.estudianteService.obtenerEstudiantes().subscribe(resp => {
      this.listaEstudiantes = resp.data;

      if (resp.success) {
        this.cargando = false;
        this.verificarEstudianteId();
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
        this.cargando = false;
      }
    }, error => () => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
      this.cargando = false;
    });
  }

  seleccionarRespuesta(respuesta: any) {
    this.seleccionRespuesta = respuesta;
    this.listaSoluciones = this.seleccionRespuesta.soluciones;
  }

  borrarFecha() {
    this.filtrarForm.get('fecha')?.setValue(null);
  }

  limpiar(): void {
    this.filtrarForm.get('estudiantes')?.setValue("");
    this.filtrarForm.get('fecha')?.setValue(null);
    this.filtrar();
  }

  open(content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdropClass: 'light-blue-backdrop' }).result.then((result) => {
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
