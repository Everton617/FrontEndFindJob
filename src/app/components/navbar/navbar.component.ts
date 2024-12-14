import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PopoverModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  userName: string;
  role: string;

  constructor(private router: Router) {
    this.userName = sessionStorage.getItem('username') || 'Usuário';
    this.role = sessionStorage.getItem('role') || '';
  }

  logout() {
    sessionStorage.removeItem('auth-token'); // Remove o token de autenticação
    this.router.navigate(['/login']); // Redireciona para a página de login
  }

}
