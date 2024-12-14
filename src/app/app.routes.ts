import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { AuthGuard } from './services/auth-guard.service';
import { HomeComponent } from './pages/home/home.component';
import { VagasComponent } from './pages/vagas/vagas.component';
import { FormUserComponent } from './pages/form-user/form-user.component';
import { FormVagasComponent } from './pages/form-vagas/form-vagas.component';
import { CompanyAuthGuard } from './services/company-auth-guard.service';
import { HistoricoComponent } from './pages/historico/historico.component';

export const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignUpComponent
  },
  {
    path: "vagas",
    component: VagasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "historico",
    component: HistoricoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "form",
    component: FormUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "form-vagas",
    component: FormVagasComponent,
    canActivate: [CompanyAuthGuard]
  }
];
