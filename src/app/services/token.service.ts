import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

roles: Array<string> = [];

  constructor() { }

  setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): any {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  setUserName(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  getUserName(): any {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  setAuthorities(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  getAuthorities(): any {
    this.roles = [];
    if(sessionStorage.getItem(AUTHORITIES_KEY)){
      let authoKey: any = sessionStorage.getItem(AUTHORITIES_KEY) == null ? [] : sessionStorage.getItem(AUTHORITIES_KEY);
      JSON.parse(authoKey).array.forEach( (authority: { authority: string; }) => {
         this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }

  logOut(): void {
    window.sessionStorage.clear();
  }
}
