import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface LoginForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;
  selectedRole: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
    console.log('Role selecionada:', role);
  }

  submit() {
    const formData = new FormData();
    formData.append('email', this.loginForm.value.email || '');
    formData.append('password', this.loginForm.value.password || '');
    formData.append('userType', this.selectedRole);

    this.loginService.loginWithFormData(formData).subscribe({
      next: () => this.toastService.success("Login realizado com sucesso!"),
      error: (error) => {
        console.error("Login error:", error);
        this.toastService.error("Erro ao fazer login. Verifique suas credenciais ou tipo de usuário.");
      }
    });

  }

  navigate() {
    this.router.navigate(["signup"]);
  }
}
