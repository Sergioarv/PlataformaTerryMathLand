import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUsuario } from '../models/loginUsuario';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

authURL = GlobalConstant.URL_ENDPOINT;

  constructor(
    private http: HttpClient,
  ) { }

  login(loginUsuario: LoginUsuario): Observable<any> {
    const login = GlobalConstant.URL_AUTH_LOGIN;
    return this.http.post<any>(this.authURL+login, loginUsuario);
  }
}
