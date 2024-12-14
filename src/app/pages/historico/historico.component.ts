import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from '@angular/common';

export interface Company {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  createdDate: string;
  company: Company;
  candidates: any[];
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss'
})
export class HistoricoComponent {

  jobs: Job[] = [];
  userId: string;

    constructor(private http: HttpClient,private toastService: ToastrService) {
      this.userId = sessionStorage.getItem('userId') || 'não encontrado';
    }

    private apiUrl = 'https://javaapi-0dzj.onrender.com/api/jobs';
    private headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('auth-token') || ''}`,
    });

    ngOnInit(): void {
      this.fetchJobs();
    }

     fetchJobs(): void {
        this.http.get<Job[]>(this.apiUrl, { headers: this.headers }).subscribe({
          next: (response) => {
            console.log('Vagas recebidas:', response);
            this.jobs = response.filter(job => {

              const isCandidate = job.candidates.some(candidate => candidate.id.toString() === this.userId);
              return isCandidate;
            });
          },
          error: (error) => {
            console.error('Erro ao buscar vagas:', error);
          },
        });
      }
}
