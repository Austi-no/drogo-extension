import { Injectable } from '@angular/core';
import {HttpRequest,
  HttpHandler, HttpInterceptor,HttpResponse, HTTP_INTERCEPTORS} from '@angular/common/http';

import {switchMap, tap} from 'rxjs/operators';
import { AuthService } from "./auth.service";
import {from} from "rxjs";

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.interceptAuth(req, next)
  }

  interceptAuth(req: HttpRequest<any>, next: HttpHandler) {
    const authService = new AuthService()
    return from(authService.fetchToken())
      .pipe(
        switchMap(res_token => {
          const headers = req.headers
            .set('Authorization', 'Bearer ' + res_token)
            // .append('Content-Type', 'application/json');
          const authReq = req.clone({
            headers
          });
          return next.handle(authReq)
            .pipe(tap(event => {
              if (event instanceof HttpResponse) {
                // console.log(" all looks good");
                // http response status code

              }
            }, error => {

              if (error.status === 401 || error.status === 500) {

              }
            })
          )
        })
      );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];


