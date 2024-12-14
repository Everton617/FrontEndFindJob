import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface SignupForm {
  name: FormControl,
  email: FormControl,
  password: FormControl,
  passwordConfirm: FormControl
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignUpComponent {
  signupForm!: FormGroup<SignupForm>;
  selectedRole: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
    console.log('Role selecionada:', role);
  }

  submit() {
    if (this.signupForm.invalid) {
      this.toastService.error("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const formData = new FormData();
    formData.append('name', this.signupForm.value.name || '');
    formData.append('email', this.signupForm.value.email || '');
    formData.append('password', this.signupForm.value.password || '');
    formData.append('passwordConfirm', this.signupForm.value.passwordConfirm || '');

    if (this.selectedRole === 'user') {
      this.loginService.signupWithFormData(formData).subscribe({
        next: () => this.toastService.success("Cadastro realizado com sucesso!"),
        error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde")
      });
    } else if (this.selectedRole === 'company') {
      this.loginService.signupCompanyWithFormData(formData).subscribe({
        next: () => this.toastService.success("Cadastro realizado com sucesso!"),
        error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde")
      });
    } else {
      this.toastService.error("Por favor, selecione um role.");
    }
  }



  navigate() {
    this.router.navigate(["/login"]);
  }
}
