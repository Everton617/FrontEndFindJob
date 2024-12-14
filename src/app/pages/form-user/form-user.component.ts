import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { HttpClient, HttpClientModule,HttpHeaders  } from '@angular/common/http';
import { ActivatedRoute,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface Experiencia {
  descricao: string;
}

interface Habilidade {
  descricao: string
}

export interface Candidato {
  id?: number;
  nome: string;
  telefone: string;
  dt_nascimento: Date | string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  area_atuacao: string;
  nv_experiencia: string;
  experiencias: Experiencia;
  habilidades: Habilidade;
}
@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, HttpClientModule, CommonModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent {
  candidatoForm!: FormGroup;
  userId: string;
  token: string;
  userName: string;

  formDataResponse: Candidato | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastService: ToastrService
  ) {

    this.userId = sessionStorage.getItem('userId') || 'não encontrado';
    this.userName = sessionStorage.getItem('username') || 'Usuário';
    this.token = sessionStorage.getItem('auth-token') || 'não encontrado';
    this.formDataResponse = JSON.parse(sessionStorage.getItem('formData') || 'null')



    this.candidatoForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      dt_nascimento: ['', Validators.required],
      endereco: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      area_atuacao: ['', Validators.required],
      nv_experiencia: ['', Validators.required],
      experiencias: this.fb.group({
        descricao: ['', Validators.required],
      }),
      habilidades: this.fb.group({
        descricao: ['', Validators.required],
      }),
    });
  }

  onSubmit() {
    if (this.candidatoForm.valid) {
      const candidato: Candidato = this.candidatoForm.value;

      if (this.candidatoForm.controls['experiencia'] && this.candidatoForm.controls['habilidades']) {
        candidato.experiencias = {
          descricao: this.candidatoForm.controls['experiencia'].value
        };
        candidato.habilidades = {
          descricao: this.candidatoForm.controls['habilidades'].value
        };
      }

      const apiUrl = `https://javaapi-0dzj.onrender.com/api/candidatos/${this.userId}`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      this.http.put<any>(apiUrl, this.candidatoForm.value, { headers }).subscribe({
        next: () => {
          this.getFormData()
          this.toastService.success("Candidato atualizado com sucesso!")
        },
        error: (error) => {
          this.toastService.error("Erro ao atualizar candidato!");
          console.error('Erro ao atualizar candidato:', error);
        },
      });
    } else {
      this.candidatoForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {

    this.getFormData();
  }


  getFormData(): void {

    const apiUrl = `https://javaapi-0dzj.onrender.com/api/candidatos/${this.userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });


    console.log(headers)


    this.http.get<Candidato>(apiUrl, { headers }).subscribe({
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



}
