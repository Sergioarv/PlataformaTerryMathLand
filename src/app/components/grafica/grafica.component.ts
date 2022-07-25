import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IDatosPromedioNotas } from 'src/app/models/datosPromedioNotas';
import { Estudiante } from 'src/app/models/estudiante';
import { Respuesta } from 'src/app/models/respuesta';
import { IDatosPromedioEstudiante } from 'src/app/models/datosPromedioEstudiante';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { RespuestaService } from 'src/app/services/respuesta.service';
import { TokenService } from 'src/app/services/token.service';
import { DecimalPipe } from '@angular/common';
declare var google: any;

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css'],
})
export class GraficaComponent implements OnInit {

  listaEstudiantes: Estudiante[];
  listaRespuestas: Respuesta[];
  listaPromedioEstudiantes: IDatosPromedioEstudiante[];
  listaPromedioNotas: IDatosPromedioNotas[]

  cargando = false;

  fechaActual: Date = new Date();

  total = 0.0;

  roles: string[];
  authority: string;

  filtrarForm = new FormGroup({
    estudiantes: new FormControl(''),
    fecha: new FormControl(null)
  });

  constructor(
    private estudianteService: EstudianteService,
    private respuestaService: RespuestaService,
    private toastrService: ToastrService,
    private tokenService: TokenService,
    private decimalPipe: DecimalPipe,
  ) {
    this.listaEstudiantes = [];
    this.listaRespuestas = [];
    this.listaPromedioNotas = [];
    this.listaPromedioEstudiantes = [];
    this.roles = [];
    this.authority = '';
  }

  ngOnInit(): void {

    this.authority = this.tokenService.getRoles();
    if (this.authority === 'estudiante')
      this.filtrarForm.get('estudiantes')?.disable();
    this.obtenerEstudiantes()
    google.charts.load('current', { packages: ['corechart'] });
  }

  filtrar(idEstudiante?: any) {

    this.cargando = true;

    const estudiante = this.filtrarForm.controls['estudiantes'].value;
    const fecha = this.filtrarForm.controls['fecha'].value;

    this.respuestaService.filtrarRespuestasGrafico(estudiante ? estudiante : idEstudiante ? idEstudiante : null, fecha ? fecha : null).subscribe(resp => {

      this.total = 0;
      this.listaPromedioNotas = resp.data.listaPromedioNotas;
      this.listaPromedioEstudiantes = resp.data.listaPromedioEstudiantes;

      if (resp.success) {
        if (this.verificarPromedioEstudiantes()) {
          this.toastrService.warning(resp.message, 'Proceso exitoso');
        } else {
          this.toastrService.success(resp.message, 'Proceso exitoso');
        }
        this.cargando = false;
      } else {
        this.toastrService.warning(resp.message, 'Proceso fallido');
        this.listaPromedioEstudiantes = [];
        this.listaPromedioNotas = [];
        this.cargando = false;
      }
      this.drawChartLine();
      this.drawChartPie();
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
  }

  verificarPromedioEstudiantes(): boolean {

    this.listaPromedioEstudiantes.forEach(dato => {
      this.total += dato.promedioestudiantes;
    });

    if (this.total == 0) {
      return true;
    } else {
      return false;
    }
  }

  obtenerEstudiantes() {
    this.cargando = true;

    this.estudianteService.listarEstudiantes().subscribe(resp => {
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

  verificarEstudianteId() {
    this.cargando = true;
    if (this.authority === 'estudiante') {
      const idEstudiante = this.tokenService.getId();
      this.filtrarForm.get('estudiantes')?.setValue(idEstudiante);
      this.filtrar(idEstudiante);
    } else {
      this.filtrar();
    }
  }

  drawChartLine() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Fecha');
    data.addColumn('number', 'Promedio de notas');

    this.listaPromedioNotas.sort(function (a, b) {
      if (a.fecha > b.fecha) { return 1; }
      if (a.fecha < b.fecha) { return -1; }
      return 0;
    });

    this.listaPromedioNotas.forEach(element => {
      data.addRows([
        [element.fecha, element.promedionotas],
      ]);
    });

    var formatNumber = new google.visualization.NumberFormat({
      pattern: '0.0'
    });

    formatNumber.format(data, 1);

    // Set chart options
    var options = {
      title: 'Promedio de notas por fechas',
      titleTextStyle: {
        color: '000000',
        fontName: 'Arial',
        fontSize: 18
      },
      height: 480,
      chartArea: { width: '80%' },
      legend: { position: 'top', alignment: 'center', maxLines: 2 },
      tooltip: { trigger: 'focused' },
      focusTarget: 'category',
      crosshair: { trigger: 'focus', orientation: 'vertical', color: 'black' },
      hAxis: {
        title: 'Fecha',
      },
      vAxis: {
        title: 'Nota',
        format: 'decimal',
        viewWindow: {
          max: 5,
          min: 0,
        },
        // ticks: this.calcIntTicks(data, 1)
        ticks: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      },
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById('chartLine_div'));
    chart.draw(data, options);
  }

  calcIntTicks(dataTable: any, step: any) {
    var min = Math.floor(dataTable.getColumnRange(1).min);
    var max = Math.ceil(dataTable.getColumnRange(1).max);
    var vals = [];
    for (var cur = min; cur <= max; cur += step) {
      vals.push(cur);
    }
    return vals;
  }

  drawChartPie() {

    const tam = this.listaPromedioEstudiantes.length;

    const encabezados: any[] = ['Nota de 5.0', 'Nota entre 4.0 a 4.9', 'Nota entre 3.0 a 3.9', 'Nota inferior a 3.0'];

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Nota');
    data.addColumn('number', 'Promedio');
    for (let i = 0; i < tam; i++) {
      data.addRows([
        [encabezados[i], this.listaPromedioEstudiantes[i].promedioestudiantes],
      ]);
    }

    if (this.total == 0 || this.listaPromedioNotas.length == 0) {
      data.addRows([
        ['Sin registros', 100],
      ]);
    }

    // Set chart options
    var options = {
      title: 'Promedio de estudintes por rangos de notas',
      titleTextStyle: {
        color: '000000',
        fontName: 'Arial',
        fontSize: 18
      },
      height: 480,
      is3D: true,
      // tooltip: { text: 'percentage' },
      chartArea: { width: '90%' },
      legend: { position: 'top', alignment: 'center', maxLines: 2 },
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(
      document.getElementById('chartPie_div')
    );
    chart.draw(data, options);
  }

  borrarFecha() {
    this.filtrarForm.get('fecha')?.setValue(null);
  }

  limpiar(): void {
    this.filtrarForm.get('estudiantes')?.setValue("");
    this.filtrarForm.get('fecha')?.setValue(null);
    this.filtrar();
  }
}
