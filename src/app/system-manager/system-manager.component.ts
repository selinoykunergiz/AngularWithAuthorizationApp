import { Component, OnInit } from "@angular/core";
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

@Component({
    templateUrl: 'system-manager.component.html'
})

export class SystemManagerComponent implements OnInit{
    users: User[] = [];

    constructor(private userService: UserService){}

    ngOnInit(){
        this.userService.getAllSystemManager().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
}