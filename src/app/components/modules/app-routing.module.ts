import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuegoComponent as JuegoComponent } from '../juego/juego.component';
import { InicioComponent } from '../inicio/inicio.component';
import { PreguntaComponent } from '../pregunta/pregunta.component';
import { EditarPreguntaComponent } from '../pregunta/editar/editar.component'
import { EstudianteComponent } from '../estudiante/estudiante.component';
import { RespuestaComponent } from '../respuesta/respuesta.component';
import { GraficaComponent } from '../grafica/grafica.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent},
  { path: '', redirectTo: 'inicio', pathMatch: 'full'},
  { path: 'juego', component: JuegoComponent },
  { path: 'pregunta', component: PreguntaComponent },
  { path: 'pregunta/editar', component: EditarPreguntaComponent },
  { path: 'estudiante', component: EstudianteComponent },
  { path: 'respuesta', component: RespuestaComponent },
  { path: 'grafica', component: GraficaComponent },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
