import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '../_models/role';
import { User } from '../_models/user';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const users: User[] = [
            { id: 1, username: 'admin', password: 'admin', firstname: 'Admin', lastname: 'User', role: Role.Admin },
            { id: 2, username: 'user', password: 'user', firstname: 'User', lastname: 'User', role: Role.User },
            { id: 3, username: 'systemmanager', password: 'systemmanager', firstname: 'SystemManager', lastname: 'SystemManager', role: Role.SystemManager },
            { id: 4, username: 'generaldirector', password: 'generaldirector', firstname: 'GeneralDirector', lastname: 'GeneralDirector', role: Role.GeneralDirector }
        ];
        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');
        const roleString = isLoggedIn && authHeader.split('.')[1];
        const role = roleString ? Role[roleString] : null;

        return of(null).pipe(mergeMap(() => {

            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user) return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstname,
                    lastName: user.lastname,
                    role: user.role,
                    token: `fake-jwt-token.${user.role}`
                });
            }

            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                if (!isLoggedIn) return unauthorised();

                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);

                const currentUser = users.find(x => x.role === role);
                if (id !== currentUser.id && role !== Role.Admin) return unauthorised();

                const user = users.find(x => x.id === id);
                return ok(user);
            }

            if (request.url.endsWith('/users/Admin') && request.method === 'GET') {
                if (role !== Role.Admin) return unauthorised();
                return ok(users);
            }

            if (request.url.endsWith('/users/SystemManager') && request.method === 'GET') {
                if (role !== Role.SystemManager) return unauthorised();
                return ok(users);
            }

            if (request.url.endsWith('/users/GeneralDirector') && request.method === 'GET') {
                if (role !== Role.GeneralDirector) return unauthorised();
                return ok(users);
            }

            return next.handle(request);
        }))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

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
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};