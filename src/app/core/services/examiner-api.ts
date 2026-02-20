import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExaminerApi {

  // ✅ Base API URL
  private readonly API = `${environment.apiUrl}/examiner`;

  constructor(private http: HttpClient) {}

  /* ===============================
     👤 PROFILE
     =============================== */

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.API}/auth/me`);
  }

  /* ===============================
     📝 EXAMS
     =============================== */

  getMyExams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/exams`);
  }

  createExam(data: {
    examName: string;
    branch: string;
    duration: number;
    totalMarks: number;
    violationLimit: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.API}/exam`, data);
  }

  getExamById(examId: number): Observable<any> {
    return this.http.get<any>(`${this.API}/exam/${examId}`);
  }

  updateExamStatus(examId: number, active: boolean): Observable<void> {
    return this.http.put<void>(
      `${this.API}/exam/${examId}/status?active=${active}`,
      {}
    );
  }

  updateViolationLimit(
    examId: number,
    violationLimit: number
  ): Observable<void> {
    return this.http.put<void>(
      `${this.API}/exam/${examId}/violation-limit`,
      { violationLimit }
    );
  }

  updateDeadline(
    examId: number,
    deadline: string
  ): Observable<void> {
    return this.http.put<void>(
      `${this.API}/exam/${examId}/deadline`,
      { deadline }
    );
  }

  deleteExam(examId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API}/exam/${examId}`
    );
  }

  /* ===============================
     ❓ QUESTIONS
     =============================== */

  addQuestion(
    examId: number,
    question: {
      question: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: string;
    }
  ): Observable<any> {
    return this.http.post<any>(
      `${this.API}/exam/${examId}/question`,
      question
    );
  }

  getQuestionsByExam(examId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.API}/exam/${examId}/questions`
    );
  }

  deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API}/question/${questionId}`
    );
  }

  uploadQuestions(examId: number, formData: FormData): Observable<any> {
    return this.http.post(
      `${this.API}/exam/${examId}/upload-questions`,
      formData
    );
  }

  /* ===============================
     📊 DASHBOARD / STATS
     =============================== */

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.API}/stats`);
  }
}
