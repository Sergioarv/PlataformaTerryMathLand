import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  constructor(
    private http: HttpClient,
  ) { }

  obtenerRespuestas(): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_RESPUESTA;

    return this.http.get<any>(URL);
  }

  filtrarRespuesta(estudiante: any, fecha: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_RESPUESTA_FILTRO;

    let params = '';

    params = estudiante ? (params.length > 0 ? params.concat('&estudiante=').concat(estudiante) : params.concat('?estudiante=').concat(estudiante)) : params;
    params = fecha ? (params.length > 0 ? params.concat('&fecha=').concat(fecha) : params.concat('?fecha=').concat(fecha)) : params;

    return this.http.get<any>(URL + params);
  }
}
