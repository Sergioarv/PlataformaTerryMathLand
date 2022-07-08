import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  constructor(
    private http: HttpClient
  ) { }

  public obtenerEstudiantes(): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE;

    return this.http.get<any>(URL);
  }

  public listarEstudiantes(): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE_LISTAR;

    return this.http.get<any>(URL);
  }

  public filtrarEstudiante(nombre: any, fechaEntrega: any): Observable<any> {

    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE_FILTRO;

    let params = '';

    if (nombre) {
      if (params.length > 0) {
        params = params.concat('&nombre=').concat(nombre);
      } else {
        params = params.concat('?nombre=').concat(nombre)
      }
    }

    if (fechaEntrega) {
      if (params.length > 0) {
        params = params.concat('&fecha=').concat(fechaEntrega);
      } else {
        params = params.concat('?fecha=').concat(fechaEntrega);
      }
    }

    return this.http.get<any>(URL + params);
  }

  public agregar(newEstudiante: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_AUTH + GlobalConstant.URL_ESTUDIANTE_AGREGAR;

    return this.http.post(URL, newEstudiante);
  }

  public actualizar(actualizarEst: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_AUTH + GlobalConstant.URL_ESTUDIANTE_EDITAR;

    return this.http.put<any>(URL, actualizarEst);
  }

  public eliminar(estudiante: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: estudiante,
    };

    return this.http.delete<any>(URL, options);
  }
}
