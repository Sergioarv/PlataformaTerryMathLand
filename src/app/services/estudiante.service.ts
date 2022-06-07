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

  public filtrarEstudiante(nombre: any, fechaEntrega: any): Observable<any> {

    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE_FILTRO;

    let params = '';

    params = nombre ? (params.length > 0 ? params.concat('&nombre=').concat(nombre) : params.concat('?nombre=').concat(nombre)) : params;
    params = fechaEntrega ? (params.length > 0 ? params.concat('&fecha=').concat(fechaEntrega) : params.concat('?fecha=').concat(fechaEntrega)) : params;

    return this.http.get<any>(URL + params);
  }

  public agregar(newEstudiante: any ): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE;

    return this.http.post(URL, newEstudiante);
  }

  public actualizar(actualizarEst: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE;

    return this.http.put<any>(URL, actualizarEst);
  }

  public eliminar(estudiante: any ): Observable<any>{
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
