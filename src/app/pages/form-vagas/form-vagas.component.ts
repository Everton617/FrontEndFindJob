import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormBuilder, FormArray, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  createdDate: string;
  company: {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
  };
  candidates: any[];
}

@Component({
  selector: 'app-form-vagas',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule,CommonModule],
  templateUrl: './form-vagas.component.html',
  styleUrl: './form-vagas.component.scss'
})
export class FormVagasComponent {
  userId: string;
  token: string;
  userName: string;
  jobForm: FormGroup;

  formDataResponse: Job[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient,private toastService: ToastrService
  ) {
    this.userId = sessionStorage.getItem('userId') || 'não encontrado';
    this.userName = sessionStorage.getItem('username') || 'Usuário';
    this.token = sessionStorage.getItem('auth-token') || 'não encontrado';

    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      requirements: ['', [Validators.required, Validators.minLength(5)]]
    });
  }



  onSubmit(): void {
    const apiUrl = `http://localhost:8080/api/companies/${this.userId}/jobs`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });


    const formData = {
      title: this.jobForm.value.title,
      description: this.jobForm.value.description,
      requirements: this.jobForm.value.requirements
    };

    console.log(formData)

    console.log(headers)

    this.http.post<any>(apiUrl, formData, { headers }).subscribe({
      next: (response) => {
        this.toastService.success("Vaga criada com sucesso!"),
        this.getFormData();
      },
      error: (error) => {
        console.error('Erro ao criar vaga:', error);
      }
    });
  }

  ngOnInit(): void {

    this.getFormData();
  }


  getFormData(): void {
    const apiUrl = `http://localhost:8080/api/jobs/companies/${this.userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<Job[]>(apiUrl, { headers }).subscribe({
      next: (response) => {
        if (response) {
          // Filtra as vagas para incluir apenas as vagas da empresa associada ao usuário
          this.formDataResponse = response.filter(job => job.company.id.toString() === this.userId);
          console.log('Vagas filtradas:', this.formDataResponse);
        } else {
          console.log('Nenhuma vaga encontrada');
        }
      },
      error: (error) => {
        console.error('Erro ao buscar os dados da empresa:', error);
      }
    });
  }



}
