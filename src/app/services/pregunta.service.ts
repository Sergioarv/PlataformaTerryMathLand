import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

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

    params = idPregunta ? (params.length > 0 ? params.concat('&id=').concat(idPregunta) : params.concat('?id=').concat(idPregunta)) : params;
    params = enunciado ? (params.length > 0 ? params.concat('&enunciado=').concat(enunciado) : params.concat('?enunciado=').concat(enunciado)) : params;

    return this.http.get<any>(URL + params);
  }
}
