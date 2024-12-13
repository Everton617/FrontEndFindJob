import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PopoverModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  userName: string;

  constructor(private router: Router) {
    this.userName = sessionStorage.getItem('username') || 'Usuário';

  }

  logout() {
    sessionStorage.removeItem('auth-token'); // Remove o token de autenticação
    this.router.navigate(['/login']); // Redireciona para a página de login
  }

}
