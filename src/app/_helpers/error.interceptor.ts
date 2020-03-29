//herhangi bir hata olup olmadıgını kontrol etmek için APIden gelen HTTP yanıtlarını durdurur.

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    constructor(private authenticationService: AuthenticationService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(request).pipe(catchError(err=> {
            if([401,403].indexOf(err.status) != -1){
            //APIden 401 ve 403 error döndüğünde otomatik oturumu kapat, 
            this.authenticationService.logout();
            location.reload(true);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }

}