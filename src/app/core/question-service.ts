// questionnaire.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './services/api.config';

// questionnaire.model.ts
export interface Questionnaire {
  id: number;
  titre: string;
  description: string;
  type: 'GESTIONNAIRE' | 'CONTRIBUTEUR';
  dureeEstimee: number;
  dateCreation: string;
  nombreQuestions: number;
  createurId: number;
  createurNom: string;
  createurPrenom: string;
  createurEmail: string;
  createurType: string;
  projetId: number;
  projetTitre: string;
  projetDescription: string;
  questions: Question[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  indexReponse: number[];
  ordre?: number;
}

export interface QuestionnaireEvaluation {
  reponses: { [key: string]: number[] };
  participantId: number;
  commentaire: string;
}

export interface QuestionnaireResult {
  score: number;
  total: number;
  percentage: number;
  feedback?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private apiUrl = apiUrl(`/questionnaires`);

  constructor(private http: HttpClient) { }

  getQuestionnairesByProject(projectId: number): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(`${this.apiUrl}/projet/1`);
  }

  createQuestionnaire(projectId: number, creatorId: number, data: any): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(
      `${this.apiUrl}/projet/1/createur/2`,
      data
    );
  }

  updateQuestionnaire(id: number, data: any): Observable<Questionnaire> {
    return this.http.put<Questionnaire>(`${this.apiUrl}/${id}`, data);
  }

  addQuestionToQuestionnaire(questionnaireId: number, question: Question): Observable<Question> {
    return this.http.post<Question>(
      `${this.apiUrl}/${questionnaireId}/questions`,
      question
    );
  }

  evaluateQuestionnaire(questionnaireId: number, evaluation: QuestionnaireEvaluation): Observable<QuestionnaireResult> {
    return this.http.post<QuestionnaireResult>(
      `${this.apiUrl}/1/evaluer`,
      evaluation
    );
  }
}