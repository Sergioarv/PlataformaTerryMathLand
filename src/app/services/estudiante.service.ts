import { HttpClient } from '@angular/common/http';
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
    console.log("Peticion", nombre, URL);
    let params = '';

    params = nombre ? (params.length > 0 ? params.concat('&nombre=').concat(nombre) : params.concat('?nombre=').concat(nombre)) : params;
    params = fechaEntrega ? (params.length > 0 ? params.concat('&fecha=').concat(fechaEntrega) : params.concat('?fecha=').concat(fechaEntrega)) : params;

    return this.http.get<any>(URL + params);
  }
}
