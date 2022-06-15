import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './components/modules/app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';

import { NavbarComponent } from './components/navbar/navbar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { JuegoComponent } from './components/juego/juego.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { DatePipe } from '@angular/common';
import { RespuestaComponent } from './components/respuesta/respuesta.component';
import { GraficaComponent } from './components/grafica/grafica.component';
import { CartillaComponent } from './components/cartilla/cartilla.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InicioComponent,
    JuegoComponent,
    PreguntaComponent,
    EstudianteComponent,
    RespuestaComponent,
    GraficaComponent,
    CartillaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  providers: [
    DatePipe
  ],
  exports: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
