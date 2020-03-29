//yetkisiz kullanıcıların sınırlı rotalara erişmesini önlemek için kullanılan bir yönlendirmedir.
import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
let AuthGuard = class AuthGuard {
    constructor(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
    }
    canActivate(route, state) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            //route un role göre kısıtlanıp kısıtlanmadıgını kontrol etmek için,
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                // role yetkilendirilmesi anasayfaya yönlendir,
                this.router.navigate(['/']);
                return false;
            }
            //yetkilendirdi return true
            return true;
        }
        //giriş yapılmadı, login sayfasına yönlendir.
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
};
AuthGuard = tslib_1.__decorate([
    Injectable({ providedIn: 'root' })
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map