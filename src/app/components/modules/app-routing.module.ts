import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuegoComponent as JuegoComponent } from '../juego/juego.component';
import { InicioComponent } from '../inicio/inicio.component';
import { PreguntaComponent } from '../pregunta/pregunta.component';
import { EditarPreguntaComponent } from '../pregunta/editar/editar.component'

const routes: Routes = [
  { path: 'inicio', component: InicioComponent},
  { path: '', redirectTo: 'inicio', pathMatch: 'full'},
  { path: 'juego', component: JuegoComponent },
  { path: 'pregunta', component: PreguntaComponent },
  { path: 'pregunta/editar', component: EditarPreguntaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
