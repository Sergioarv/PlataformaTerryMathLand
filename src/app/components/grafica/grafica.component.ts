import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Estudiante } from 'src/app/models/estudiante';
import { Respuesta } from 'src/app/models/respuesta';
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

  cargando = false;

  fechaActual: Date = new Date();

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
  }

  ngOnInit(): void {

    google.charts.load('current', { packages: ['corechart'] });

    this.filtrar(true);

    google.charts.setOnLoadCallback(this.drawChartPie);

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
        } else {
          this.drawChartLine();
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
        //this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 4000, closeButton: true});
        this.cargando = false;
        this.drawChartLine();
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
    data.addColumn('string', 'fecha');
    this.listaRespuestas.forEach(item => {
      data.addColumn('number', item.idrespuesta) + ','
    });

    for (var i = 0; i < this.listaRespuestas.length; i++) {
      data.addRows([

      ]);
    }

    // Set chart options
    var options = {
      chart: {
        title: 'Notas por fechas',
        subtitle: 'in millions of dollars (USD)',
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
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Nota');
    data.addColumn('number', 'Promedio');
    data.addRows([
      ['Nota de 5.0', 3.0],
      ['Nota entre 4.9 a 4.0', 1.0],
      ['Nota entre 3.9 a 3.0', 10.0],
      ['Nota inferior a 3.0', 5],
    ]);

    // Set chart options
    var options = {
      title: 'How Much Pizza I Ate Last Night',
      height: 480,
      is3D: true,
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
