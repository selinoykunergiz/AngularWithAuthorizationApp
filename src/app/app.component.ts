import { Component } from '@angular/core';
import { User } from './_models/user';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { Role } from './_models/role';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser: User;
  constructor(private router: Router,
    private authenticationService: AuthenticationService){
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  //giriş yapan kullanıcı admin rolundeyse isadmin() -> true döner, admin den baska bir kullanıcı için false döner.
  get isAdmin(){
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  get isSystemManager(){
    return this.currentUser && this.currentUser.role === Role.SystemManager;
  }

  get isGeneralDirector(){
    return this.currentUser && this.currentUser.role === Role.GeneralDirector;
  }
  
  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
