import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  constructor(
    private http: HttpClient
  ) { }

  public filtrarDocente(nombre: any, documento: any): Observable<any> {

    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_DOCENTE_FILTRO;

    let params = '';

    if (nombre) {
      if (params.length > 0) {
        params = params.concat('&nombre=').concat(nombre);
      } else {
        params = params.concat('?nombre=').concat(nombre)
      }
    }

    if (documento) {
      if (params.length > 0) {
        params = params.concat('&documento=').concat(documento);
      } else {
        params = params.concat('?documento=').concat(documento);
      }
    }

    return this.http.get<any>(URL + params);
  }

  public agregar(newdocente: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_AUTH + GlobalConstant.URL_DOCENTE_AGREGAR;

    return this.http.post(URL, newdocente);
  }

  public actualizar(actualizarDoc: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_AUTH + GlobalConstant.URL_DOCENTE_EDITAR;

    return this.http.put<any>(URL, actualizarDoc);
  }

  public eliminar(docente: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_DOCENTE;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: docente,
    };

    return this.http.delete<any>(URL, options);
  }
}
