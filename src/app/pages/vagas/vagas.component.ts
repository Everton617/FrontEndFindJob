import { Component,OnInit  } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
export interface Company {
  id: number;
  nome: string;
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
  selector: 'app-vagas',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './vagas.component.html',
  styleUrl: './vagas.component.scss'
})
export class VagasComponent {

  jobs: Job[] = [];
  userId: string;
  token: string;
  formDataResponse: any | null = null;

  constructor(private http: HttpClient,private toastService: ToastrService,private router: Router) {
    this.userId = sessionStorage.getItem('userId') || 'não encontrado';
    this.token = sessionStorage.getItem('auth-token') || 'não encontrado';
  }

  private apiUrl = 'https://javaapi-0dzj.onrender.com/api/jobs';
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${sessionStorage.getItem('auth-token') || ''}`,
  });



  fetchJobs(): void {
    this.http.get<Job[]>(this.apiUrl, { headers: this.headers }).subscribe({
      next: (response) => {
        console.log('Vagas recebidas:', response);
        this.jobs = response.filter(job => {

          const isCandidate = job.candidates.some(candidate => candidate.id.toString() === this.userId);
          return !isCandidate;
        });
      },
      error: (error) => {
        console.error('Erro ao buscar vagas:', error);
      },
    });
  }

   ngOnInit(): void {
     this.fetchJobs();
      this.getFormData();
    }


    getFormData(): void {

      const apiUrl = `https://javaapi-0dzj.onrender.com/api/candidatos/${this.userId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });


      console.log(headers)


      this.http.get<any>(apiUrl, { headers }).subscribe({
        next: (response) => {
          if (response) {

            console.log('Formulário preenchido:', response);
            this.formDataResponse = response;
          } else {
            console.log('Candidato não encontrado ou formulário não preenchido');
          }
        },
        error: (error) => {
          console.error('Erro ao buscar os dados do candidato:', error);

        }
      });
    }

    applyForJob(jobId: number): void {
      if (this.formDataResponse) { // Verifica se o formulário foi preenchido
          const registerUrl = `${this.apiUrl}/${jobId}/register/${this.userId}`;
          this.http.post(registerUrl, null, { headers: this.headers }).subscribe({
              next: () => {
                  this.toastService.success("Currículo enviado com sucesso!");
                  this.fetchJobs();
              },
              error: (error) => {
                  console.error("Erro ao se candidatar à vaga:", error); // Log do erro
                  this.toastService.error("Erro ao se candidatar. Tente novamente mais tarde.");
                  this.router.navigate(['/form'])
                },
          });
      } else {
          this.toastService.error("Por favor, preencha seu formulário antes de se candidatar a vagas.");
      }
  }


}
