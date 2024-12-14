import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl: string = "http://localhost:8080/auth";

  constructor(private httpClient: HttpClient,private router: Router) { }

  loginWithFormData(formData: FormData) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", formData).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("username", value.name);
        sessionStorage.setItem("role", value.role);
        sessionStorage.setItem("userId", value.id.toString());
        this.router.navigate(['/home']);
        console.log(sessionStorage.getItem("userId"))
        console.log(value.token)
        console.log(value.role)
      })
    );
  }


  signupWithFormData(formData: FormData) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register", formData).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("username", value.name);
        this.router.navigate(['/login']);
      })
    );
  }

  loginCompanyWithFormData(formData: FormData) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/company/login", formData).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("username", value.name);
        sessionStorage.setItem("role", value.role);
        sessionStorage.setItem("userId", value.id.toString());
        this.router.navigate(['/home']);
        console.log(sessionStorage.getItem("userId"))
        console.log(value.token)
        console.log(value.role)
      })
    );
  }


  signupCompanyWithFormData(formData: FormData) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/company/register", formData).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("username", value.name);
        this.router.navigate(['/login']);
        console.log(value.token)
      })
    );
  }
}
