import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class CartillaService {

  constructor(
    private http: HttpClient
  ) { }

  obtenerCartillas(): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_CARTILLA;

    return this.http.get<any>(URL);
  }

  filtrarCartilla(idcartilla: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_CARTILLA_FILTRO;

    let params = '';

    if(idcartilla){
      if(params.length > 0){
        params = params.concat('&idcartilla=').concat(idcartilla);
      }else{
        params = params.concat('?idcartilla=').concat(idcartilla);
      }
    }

    return this.http.get<any>(URL + params);
  }

  filtrarPreguntasCartilla(idcartilla: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_CARTILLA_FILTRO;

    let params = '';

    if(idcartilla){
      if(params.length > 0){
        params = params.concat('&idcartilla=').concat(idcartilla);
      }else{
        params = params.concat('?idcartilla=').concat(idcartilla);
      }
    }

    return this.http.get<any>(URL + params);
  }
}
