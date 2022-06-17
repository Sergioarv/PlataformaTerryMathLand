import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cartilla } from '../models/cartilla';
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

  crearCartilla(newCartilla: Cartilla): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_CARTILLA;

    return this.http.post(URL, newCartilla);
  }
  
  eliminarCartilla(cartilla: Cartilla): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_CARTILLA;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: cartilla,
    };

    return this.http.delete<any>(URL, options);
  }

  actualizarCartilla(newCartilla: Cartilla): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_CARTILLA;

    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put<any>(URL, newCartilla, httpOptions);
  }
}
