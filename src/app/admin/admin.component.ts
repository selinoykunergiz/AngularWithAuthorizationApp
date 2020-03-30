import { Component, OnInit } from "@angular/core";
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { first } from 'rxjs/operators';

@Component({
    templateUrl: 'admin.component.html'
})

export class AdminComponent implements OnInit{
    users: User[] = [];

    constructor(private userService: UserService){}

    ngOnInit(){
        this.userService.getAllAdmin().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
}