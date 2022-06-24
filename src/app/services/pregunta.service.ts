import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';
import { Pregunta } from '../models/pregunta';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {
  
  constructor(
    private http: HttpClient
  ) { }

  obtenerPreguntas(): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_PREGUNTA;

    return this.http.get<any>(URL);
  }

  filtrarPregunta(idPregunta: any, enunciado: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_PREGUNTA_FILTRO;

    let params = '';

    if (idPregunta) {
      if (params.length > 0) {
        params = params.concat('&id=').concat(idPregunta);
      } else {
        params = params.concat('?id=').concat(idPregunta)
      }
    }

    if (enunciado) {
      if (params.length > 0) {
        params = params.concat('&enunciado=').concat(enunciado);
      } else {
        params = params.concat('?enunciado=').concat(enunciado)
      }
    }

    return this.http.get<any>(URL + params);
  }

  crearPregunta(imagen: any, preguntaCrear: Pregunta) {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_PREGUNTA;
    const preguntaCreadaJson = JSON.stringify(preguntaCrear);
    const formData = new FormData();
    formData.append('file', imagen);
    formData.append('pregunta', preguntaCreadaJson);

    return this.http.post<any>(URL, formData);
  }

  editarPregunta(imagen: File, preguntaEditada: Pregunta): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_PREGUNTA_EDITAR;
    const preguntaEditadaJson = JSON.stringify(preguntaEditada);
    const formData = new FormData();
    formData.append('file', imagen);
    formData.append('pregunta', preguntaEditadaJson);

    return this.http.post<any>(URL, formData);
  }

  eliminarPregunta(preguntaEliminar: Pregunta) {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_PREGUNTA;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: preguntaEliminar,
    };

    return this.http.delete<any>(URL, options);
  }

}
