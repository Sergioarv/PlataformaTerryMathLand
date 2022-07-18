import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './components/modules/app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { DatePipe, DecimalPipe } from '@angular/common';
import { interceptorProvider } from './interceptors/est-interceptor.service';

import { NavbarComponent } from './components/navbar/navbar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { JuegoComponent } from './components/juego/juego.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { RespuestaComponent } from './components/respuesta/respuesta.component';
import { GraficaComponent } from './components/grafica/grafica.component';
import { CartillaComponent } from './components/cartilla/cartilla.component';
import { LoginComponent } from './components/login/login.component';
import { DocenteComponent } from './components/docente/docente.component';


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
    CartillaComponent,
    LoginComponent,
    DocenteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule,
    NgbModule,
    DragDropModule,
    ToastrModule.forRoot({
      maxOpened: 2,
      timeOut: 3000,
      closeButton: true,
      newestOnTop: true,
      countDuplicates:true,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    })
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    interceptorProvider
  ],
  exports: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
