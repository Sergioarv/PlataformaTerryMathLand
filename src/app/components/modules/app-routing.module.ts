import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuegoComponent as JuegoComponent } from '../juego/juego.component';
import { InicioComponent } from '../inicio/inicio.component';
import { PreguntaComponent } from '../pregunta/pregunta.component';
import { EstudianteComponent } from '../estudiante/estudiante.component';
import { RespuestaComponent } from '../respuesta/respuesta.component';
import { GraficaComponent } from '../grafica/grafica.component';
import { CartillaComponent } from '../cartilla/cartilla.component';
import { LoginComponent } from '../login/login.component';
import { EstGuardService as guard } from 'src/app/guards/est-guard.service';


const routes: Routes = [
  { path: 'inicio', component: InicioComponent, canActivate: [guard], data: {expectedRol: ['admin', 'docente', 'estudiante']}},
  { path: 'juego', component: JuegoComponent, canActivate: [guard], data: {expectedRol: ['admin', 'docente', 'estudiante']}},
  { path: 'pregunta', component: PreguntaComponent, canActivate: [guard], data: {expectedRol: ['admin', 'docente']}},
  { path: 'estudiante', component: EstudianteComponent, canActivate: [guard], data: {expectedRol: ['admin', 'docente']}},
  { path: 'respuesta', component: RespuestaComponent, canActivate: [guard], data: {expectedRol: ['admin', 'docente', 'estudiante']}},
  { path: 'grafica', component: GraficaComponent, canActivate: [guard], data: {expectedRol: ['admin', 'docente', 'estudiante']}},
  { path: 'cartilla', component: CartillaComponent, canActivate: [guard], data: {expectedRol: ['admin', 'docente']}},
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'inicio', pathMatch: 'full'},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
