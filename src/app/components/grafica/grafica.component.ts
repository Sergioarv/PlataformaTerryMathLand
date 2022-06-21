import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IDatosPromedioNotas } from 'src/app/models/datosPromedioNotas';
import { Estudiante } from 'src/app/models/estudiante';
import { Respuesta } from 'src/app/models/respuesta';
import { IDatosPromedioEstudiante } from 'src/app/models/datosPromedioEstudiante';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { RespuestaService } from 'src/app/services/respuesta.service';
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

  filtrarForm = new FormGroup({
    estudiantes: new FormControl(''),
    fecha: new FormControl(null)
  });

  constructor(
    private estudianteService: EstudianteService,
    private respuestaService: RespuestaService,
    private toastrService: ToastrService
  ) {
    this.listaEstudiantes = [];
    this.listaRespuestas = [];
    this.listaPromedioNotas = [];
    this.listaPromedioEstudiantes = [];
  }

  ngOnInit(): void {

    google.charts.load('current', { packages: ['corechart'] });

    this.filtrar(true);
  }

  filtrar(inicio?: boolean) {

    this.cargando = true;

    const estudiante = this.filtrarForm.controls['estudiantes'].value;
    const fecha = this.filtrarForm.controls['fecha'].value;

    this.respuestaService.filtrarRespuestasGrafico(estudiante ? estudiante : null, fecha ? fecha : null).subscribe(resp => {

      this.total = 0;
      this.listaPromedioNotas = resp.data.listaPromedioNotas;
      this.listaPromedioEstudiantes = resp.data.listaPromedioEstudiantes;

      if (resp.success) {
        if (this.verificarPromedioEstudiantes()) {
          this.toastrService.warning(resp.message, 'Proceso exitoso');
        } else {
          this.toastrService.success(resp.message, 'Proceso exitoso');
        }
        
        if (inicio) {
          this.obtenerEstudiantes();
        }
        this.cargando = false;
      } else {
        console.log(this.total);
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
        this.drawChartLine();
        this.drawChartPie();
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
        this.cargando = false;
      }
    }, error => () => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
      this.cargando = false;
    });
  }

  drawChartLine() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Fecha');
    data.addColumn('number', 'Promedio de notas');

    this.listaPromedioNotas.forEach(element => {
      data.addRows([
        [element.fecha, element.promedionotas],
      ]);
    })

    // Set chart options
    var options = {
      title: 'Promedio de notas por fechas',
      titleTextStyle: {
        color: '000000',
        fontName: 'Arial',
        fontSize: 18
      },
      height: 480,
      chartArea: { width: '90%' },
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
        ticks: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      },
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById('chartLine_div'));
    chart.draw(data, options);
  }

  drawChartPie() {

    const tam = this.listaPromedioEstudiantes.length;

    const encabezados: any[] = ['Nota de 5.0', 'Nota entre 4. a 4.9', 'Nota entre 3.0 a 3.9', 'Nota inferior a 3.0'];

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
