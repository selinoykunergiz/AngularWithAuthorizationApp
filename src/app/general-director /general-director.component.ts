import { Component, OnInit } from "@angular/core";
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { first } from 'rxjs/operators';

@Component({
    templateUrl: 'general-director.component.html'
})

export class GeneralDirectorComponent implements OnInit{
    users: User[] = [];

    constructor(private userService: UserService){}

    ngOnInit(){
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
}