import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentApi {

  /* ================================
     🌐 BASE URLs
     ================================ */

  private readonly SPRING_API = environment.apiUrl;
  private readonly AI_API = environment.aiUrl;

  constructor(private http: HttpClient) {}

  /* ================================
     🎓 EXAMS
     ================================ */

  getAvailableExams(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.SPRING_API}/student/exams`
    );
  }

  startExam(examId: number): Observable<any> {
    return this.http.post(
      `${this.SPRING_API}/student/exam/${examId}/start`,
      {}
    );
  }

  submitExam(examId: number): Observable<any> {
    return this.http.post(
      `${this.SPRING_API}/student/exam/${examId}/submit`,
      {}
    );
  }

  getExamForPlayer(examId: number): Observable<any> {
    return this.http.get(
      `${this.SPRING_API}/student/exam/${examId}`
    );
  }

  /* ================================
     ✍️ ANSWERS
     ================================ */

  saveAnswer(data: {
    examId: number;
    questionId: number;
    selectedAnswer: string;
  }): Observable<any> {
    return this.http.post(
      `${this.SPRING_API}/student/answer`,
      data
    );
  }

  /* ================================
     📊 RESULTS
     ================================ */

  getMyResults(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.SPRING_API}/student/attempts`
    );
  }

  /* ================================
     🤖 PROCTORING (SPRING BOOT)
     ================================ */

  reportViolation(data: {
    examId: number;
    violationType: string;
  }): Observable<any> {
    return this.http.post(
      `${this.SPRING_API}/proctor/violation`,
      data
    );
  }

  /* ================================
     🤖 AI PROCTORING (FASTAPI)
     ================================ */

  sendFrameToAI(
    endpoint: string,
    formData: FormData
  ): Observable<any> {
    // endpoint example: '/analyze-frame'
    return this.http.post(
      `${this.AI_API}${endpoint}`,
      formData
    );
  }

  /* ================================
     👤 PROFILE
     ================================ */

  getProfile(): Observable<any> {
    return this.http.get<any>(
      `${this.SPRING_API}/auth/me`
    );
  }
}
