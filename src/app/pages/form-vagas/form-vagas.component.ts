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
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './form-vagas.component.html',
  styleUrl: './form-vagas.component.scss'
})
export class FormVagasComponent {
  userId: string;
  token: string;
  userName: string;
  jobForm: FormGroup;
  userRole: string;

  formDataResponse: Job[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private toastService: ToastrService
  ) {
    this.userId = sessionStorage.getItem('userId') || 'não encontrado';
    this.userName = sessionStorage.getItem('username') || 'Usuário';
    this.token = sessionStorage.getItem('auth-token') || 'não encontrado';
    this.userRole = sessionStorage.getItem('role') || 'não encontrado'
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      requirements: ['', [Validators.required, Validators.minLength(5)]]
    });
  }



  onSubmit(): void {
    const apiUrl = `https://javaapi-0dzj.onrender.com/api/companies/${this.userId}/jobs`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });


    const formData = {
      title: this.jobForm.value.title,
      description: this.jobForm.value.description,
      requirements: this.jobForm.value.requirements,
      userRole: this.userRole
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
    const apiUrl = `https://javaapi-0dzj.onrender.com/api/jobs/companies/${this.userId}?userType=${this.userRole}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<Job[]>(apiUrl, { headers }).subscribe({
      next: (response) => {
        if (response && response.length > 0) {

          this.formDataResponse = response.filter(job => job.company.id.toString() === this.userId);
          console.log('Vagas filtradas:', this.formDataResponse);

          if (this.formDataResponse.length === 0) {
            console.log('Nenhuma vaga encontrada para esta empresa.');

          }

        } else {
          console.log('Nenhuma vaga encontrada.');


        }
      },
      error: (error) => {
        console.error('Erro ao buscar os dados da empresa:', error);

      }
    });
  }



}
