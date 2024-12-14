import { Component,OnInit  } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
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
  candidates: any[]; // Substituir por uma interface específica, se necessário
}

@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './vagas.component.html',
  styleUrl: './vagas.component.scss'
})
export class VagasComponent {

  jobs: Job[] = [];
  userId: string;

  constructor(private http: HttpClient,private toastService: ToastrService) {
    this.userId = sessionStorage.getItem('userId') || 'não encontrado';
  }

  private apiUrl = 'http://localhost:8080/api/jobs';
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${sessionStorage.getItem('auth-token') || ''}`,
  });

  ngOnInit(): void {
    this.fetchJobs(); // Busca as vagas ao inicializar o componente
  }

  fetchJobs(): void {
    this.http.get<Job[]>(this.apiUrl, { headers: this.headers }).subscribe({
      next: (response) => {
        console.log('Vagas recebidas:', response);
        this.jobs = response.filter(job => {
          // Filtra as vagas para remover aquelas em que o usuário está registrado como candidato
          const isCandidate = job.candidates.some(candidate => candidate.id.toString() === this.userId);
          return !isCandidate; // Mantém apenas as vagas em que o usuário não é candidato
        });
      },
      error: (error) => {
        console.error('Erro ao buscar vagas:', error);
      },
    });
  }



  applyForJob(jobId: number): void {
    const registerUrl = `${this.apiUrl}/${jobId}/register/${this.userId}`;

    this.http.post(registerUrl, null, { headers: this.headers }).subscribe({
      next: () => {
        this.toastService.success("Currículo enviado com sucesso!"),
        this.fetchJobs();
      },
      error: (error) => {
        this.toastService.error("Erro inesperado! Tente novamente mais tarde")
      },
    });
  }
}
