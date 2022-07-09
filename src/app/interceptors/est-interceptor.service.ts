import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { catchError, concatMap } from 'rxjs/operators';
import { JwtDto } from '../models/jwtDto';
import { AuthService } from '../services/auth.service';

const AUTHORIZATION = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class EstInterceptorService implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.tokenService.isLogged()) {
      return next.handle(req);
    }

    let initReq = req;
    let token = this.tokenService.getToken();
    initReq = this.addToken(req, token);

    return next.handle(initReq).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status == 401) {
        const dto: JwtDto = new JwtDto(this.tokenService.getToken());
        return this.authService.refresh(dto).pipe(concatMap((data) => {
          this.tokenService.setToken(data.data.token);
          initReq = this.addToken(req, data.data.token);
          return next.handle(initReq);
        }));
      } else {
        this.tokenService.logOut();
        return throwError(err);
      }
    }));
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ headers: req.headers.set(AUTHORIZATION, 'Bearer ' + token) });
  }
}

export const interceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: EstInterceptorService, multi: true }]