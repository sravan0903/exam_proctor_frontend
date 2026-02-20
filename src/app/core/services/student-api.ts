import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentApi {

  /* ================================
     🌐 BASE URLs
     ================================ */
  private SPRING_API = 'https://exam-proctor-backend-oeao.onrender.com';
  private AI_API = 'http://localhost:8001';

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
      null
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
    aiUrl: string,
    formData: FormData
  ): Observable<any> {
    // aiUrl example:
    // http://localhost:8001/analyze-frame
    return this.http.post(aiUrl, formData);
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
