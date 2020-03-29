//uygulamanın oturumu açmak ve oturumu kapatmak için kullanılır.
//oturum açmak için kullanıcının bilgilerini API'ye gönderir ve bir jwt tokenın yanıtını kontrol eder. Varsa kimlik doğrulamasının
//başarılı olduğu anlamına gelir. Böylece jwt de dahil olmak üzere kullanıcı ayrıntıları localStorage a eklenir.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root'})
export class AuthenticationService {
    
    //BehaviorSubject; şimdiki/geçerli değer kavramına sahip olan bir subject türüdür. 
    //En son yayılan değeri hafızada tutar. Yeni bir Observer abonelik yapınca bu değer anında BehaviorSubject aboneye iletilir. 
    //BehaviorSubject, yaratılırken bir başlangıç değeri alır.
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject= new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        //asObservable -> kullanıcının bilgilerini gizlemek için kullanırız.
        this.currentUser = this.currentUserSubject.asObservable();
    }

    //yalnızca oturum açmış kullanıcının geçerli değerini almak istediğimizde kullanırız.
    public get currentUserValue(): User{
        return this.currentUserSubject.value;
    }

    login(username: string, password: string){
        return this.http.post<any>(`/users/authenticate`, { username, password})
        .pipe(map(user => {
            //yanıtta jwt token varsa giriş başarılı,
            if(user && user.token){
            //kullanıcının sayfa yenilemeleri arasında oturum açmasını sağlamak için kullanıcı bilgilerini ve
            // jwt tokenı localStorage da tutar.           
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
        }
        return user;
        }));
    }

    logout(){
    //oturumu kapatmak için kullanıcıyı localStorage dan kaldır,
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    }
}