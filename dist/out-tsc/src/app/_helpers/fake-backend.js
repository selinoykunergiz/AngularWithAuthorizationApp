import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '../_models/role';
let FakeBackendInterceptor = class FakeBackendInterceptor {
    intercept(request, next) {
        const users = [
            { id: 1, username: 'admin', password: 'admin', firstname: 'Admin', lastname: 'User', role: Role.Admin },
            { id: 2, username: 'user', password: 'user', firstname: 'User', lastname: 'User', role: Role.User }
        ];
        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');
        const roleString = isLoggedIn && authHeader.split('.')[1];
        const role = roleString ? Role[roleString] : null;
        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {
            // authenticate - public
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user)
                    return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    token: `fake-jwt-token.${user.role}`
                });
            }
            // get user by id - admin or user (user can only access their own record)
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                if (!isLoggedIn)
                    return unauthorised();
                // get id from request url
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);
                // only allow normal users access to their own record
                const currentUser = users.find(x => x.role === role);
                if (id !== currentUser.id && role !== Role.Admin)
                    return unauthorised();
                const user = users.find(x => x.id === id);
                return ok(user);
            }
            // get all users (admin only)
            if (request.url.endsWith('/users') && request.method === 'GET') {
                if (role !== Role.Admin)
                    return unauthorised();
                return ok(users);
            }
            // pass through any requests not handled above
            return next.handle(request);
        }))
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
        // private helper functions
        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }
        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }
        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
};
FakeBackendInterceptor = tslib_1.__decorate([
    Injectable()
], FakeBackendInterceptor);
export { FakeBackendInterceptor };
//# sourceMappingURL=fake-backend.js.map