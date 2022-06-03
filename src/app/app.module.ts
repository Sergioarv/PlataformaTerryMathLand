import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './components/modules/app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';

import { NavbarComponent } from './components/navbar/navbar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { JuegoComponent } from './components/juego/juego.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';
import { EditarPreguntaComponent } from './components/pregunta/editar/editar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InicioComponent,
    JuegoComponent,
    PreguntaComponent,
    EditarPreguntaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  exports: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
