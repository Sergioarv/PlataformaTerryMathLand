import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];
  rolReal = '';

  constructor(
    private router: Router
  ) { }

  setToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): any {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  getId(): string {
    if (!this.isLogged()) {
      return '';
    }
    const token = this.getToken();
    const values = this.decodePayload(token);
    return values.id;
  }

  private decodePayload(token: string): any {
    const payload = token.split(".")[1];
    const payloadDecoded = atob(payload);
    return JSON.parse(payloadDecoded);
  }

  public getRoles(): string {
    if (!this.isLogged()) {
      return '';
    }
    const token = this.getToken();
    const values = this.decodePayload(token);
    this.roles = values.roles;

    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.rolReal = 'admin';
      } else if (rol === 'ROLE_DOCENTE') {
        this.rolReal = 'docente';
      } else if (rol === 'ROLE_ESTUDIANTE') {
        this.rolReal = 'estudiante';
      }  
    });
    return this.rolReal;
  }

  logOut(): void {
    window.localStorage.clear();
    this.router.navigate(['/login'])
  }
}
