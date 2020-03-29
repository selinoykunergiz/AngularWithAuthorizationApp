import * as tslib_1 from "tslib";
//client üzerinden gelen istek, interceptor aracılığıyla değişmekte ve yeni haliyle sunucuya gönderilmektedir.
import { Injectable } from '@angular/core';
let JwtInterceptor = class JwtInterceptor {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    intercept(request, next) {
        //varsa jwt token ile authorization header ekle,
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ${'
                }
            });
        }
    }
};
JwtInterceptor = tslib_1.__decorate([
    Injectable()
], JwtInterceptor);
export { JwtInterceptor };
//# sourceMappingURL=jwt.interceptor.js.map