import { Component } from '@angular/core';
import { FormBuilder,FormArray, FormGroup, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
interface Curso {
  id?: number;
  nome: string;
  nv_educacional: string;
  instituicao: string;
  conclusao: string;
}

interface Experiencia {
  id?: number;
  empresa: string;
  cargo: string;
  responsabilidades: string;
  dt_inicio: string;
  dt_termino: string;
}

interface Habilidades {
  id?: number;
  nome: string;
  tipo: string;
}

export interface Candidato {
  id?: number;
  nome: string;
  telefone: string;
  dt_nascimento: Date | string; // Usar Date ou string (ISO 8601)
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  area_atuacao: string;
  nv_experiencia: string;
  cursos: Curso[];
  experiencias: Experiencia[];
  habilidades: Habilidades[];
}
@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [BrowserModule,
    ReactiveFormsModule,],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss'
})

export class CurriculumComponent {
  candidatoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.candidatoForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],  // Remova se não for necessário
      telefone: ['', Validators.required],
      dt_nascimento: ['', Validators.required],
      endereco: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      area_atuacao: ['', Validators.required],
      nv_experiencia: ['', Validators.required],
      cursos: this.fb.array([]),
      experiencias: this.fb.array([]),
      habilidades: this.fb.array([])
    });
  }

  get cursos(): FormArray { // Define a getter for the cursos FormArray
    return this.candidatoForm.get('cursos') as FormArray;
  }

  get habilidades(): FormArray { // Define a getter for the cursos FormArray
    return this.candidatoForm.get('cursos') as FormArray;
  }

  get experiencias(): FormArray { // Define a getter for the cursos FormArray
    return this.candidatoForm.get('cursos') as FormArray;
  }

  // Métodos para adicionar campos dinamicamente para Cursos, Experiências e Habilidades
  addCurso() {
    const cursosArray = this.candidatoForm.get('cursos') as FormArray;
    cursosArray.push(this.fb.group({
      nome: ['', Validators.required],
      nv_educacional: ['', Validators.required],
      instituicao: ['', Validators.required],
      conclusao: ['', Validators.required]
    }));
  }


  addExperiencia() {
    const experienciasArray = this.candidatoForm.get('experiencias') as FormArray;
    experienciasArray.push(this.fb.group({
      empresa: ['', Validators.required],
      cargo: ['', Validators.required],
      responsabilidades: ['', Validators.required],
      dt_inicio: ['', Validators.required],
      dt_termino: ['', Validators.required],
    }));
  }

  addHabilidade() {
    const habilidadesArray = this.candidatoForm.get('habilidades') as FormArray;
    habilidadesArray.push(this.fb.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required]
    }));
  }

  removerCurso(index: number) {
    const cursosArray = this.candidatoForm.get('cursos') as FormArray;
    cursosArray.removeAt(index);
  }

  removerExperiencia(index: number) {
    const experienciasArray = this.candidatoForm.get('experiencias') as FormArray;
    experienciasArray.removeAt(index);
  }

  removerHabilidade(index: number) {
    const habilidadesArray = this.candidatoForm.get('habilidades') as FormArray;
    habilidadesArray.removeAt(index);
  }



  onSubmit() {
    if (this.candidatoForm.valid) {
      const candidato: Candidato = this.candidatoForm.value;
      console.log(candidato); // Envie os dados para o seu backend
      // ... lógica para enviar dados para a API
    }
  }
}
