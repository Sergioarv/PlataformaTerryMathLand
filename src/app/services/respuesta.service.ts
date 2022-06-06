import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
