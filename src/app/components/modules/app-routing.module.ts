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
import { DocenteComponent } from '../docente/docente.component';

import { EstGuardService } from 'src/app/guards/est-guard.service';
import { LoginGuard } from 'src/app/guards/login.guard';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent, canActivate: [EstGuardService], data: {expectedRol: ['admin', 'docente', 'estudiante']}},
  { path: 'juego', component: JuegoComponent, canActivate: [EstGuardService], data: {expectedRol: ['admin', 'docente', 'estudiante']}},
  { path: 'pregunta', component: PreguntaComponent, canActivate: [EstGuardService], data: {expectedRol: ['admin', 'docente']}},
  { path: 'docente', component: DocenteComponent, canActivate: [EstGuardService], data: {expectedRol: ['admin']}},
  { path: 'estudiante', component: EstudianteComponent, canActivate: [EstGuardService], data: {expectedRol: ['admin', 'docente']}},
  { path: 'respuesta', component: RespuestaComponent, canActivate: [EstGuardService], data: {expectedRol: ['admin', 'docente', 'estudiante']}},
  { path: 'grafica', component: GraficaComponent, canActivate: [EstGuardService], data: {expectedRol: ['admin', 'docente', 'estudiante']}},
  { path: 'cartilla', component: CartillaComponent, canActivate: [EstGuardService], data: {expectedRol: ['admin', 'docente']}},
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  { path: '', redirectTo: 'inicio', pathMatch: 'full'},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
