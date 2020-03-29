//yetkisiz kullanıcıların sınırlı rotalara erişmesini önlemek için kullanılan bir yönlendirmedir.

import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({ providedIn: 'root'})

export class AuthGuard implements CanActivate{

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const currentUser = this.authenticationService.currentUserValue;
        if(currentUser){
           //route un role göre kısıtlanıp kısıtlanmadıgını kontrol etmek için,
           if(route.data.roles && route.data.roles.indexOf(currentUser.role) === -1){
           // role yetkilendirilmesi anasayfaya yönlendir,
           this.router.navigate(['/']);    
           return false;
           } 
           //yetkilendirdi return true
           return true;
        }
        //giriş yapılmadı, login sayfasına yönlendir.
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url}});
        return false;
    }
}