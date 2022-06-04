import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstudianteConstant } from '../utils/constants/estudiante.constants';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(
    private http: HttpClient
  ) { }

  public filtrarEstudiante(nombre: any): Observable<any> {

    const URL = GlobalConstant.URL_ENDPOINT + EstudianteConstant.URL_ESTUDIANTE + EstudianteConstant.URL_ESTUDIANTE_FILTRO;
    console.log("Peticion", nombre, URL);
    let params = '';

    params = nombre ? params.concat('?nombre=').concat(nombre) : params;

    return this.http.get<any>(URL + params);
  }
}
