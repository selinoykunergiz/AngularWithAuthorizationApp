import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { Role } from './_models/role';
import { SystemManagerComponent } from './system-manager/system-manager.component';
import { LoginComponent } from './login/login.component';
import { GeneralDirectorComponent } from './general-director /general-director.component';

const appRoutes: Routes  = [
    { path: '', component: HomeComponent, canActivate:[AuthGuard]},
    { path: 'admin', component: AdminComponent, canActivate:[AuthGuard], data:{roles:[Role.Admin]}},
    { path: 'systemmanager', component: SystemManagerComponent, canActivate:[AuthGuard], data:{roles:[Role.SystemManager]}},
    { path: 'generaldirector', component: GeneralDirectorComponent, canActivate:[AuthGuard], data:{roles:[Role.GeneralDirector]}},
    { path: 'login', component: LoginComponent},
    { path: '**', redirectTo:''}
];

export const routing = RouterModule.forRoot(appRoutes);