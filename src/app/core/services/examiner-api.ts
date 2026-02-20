import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExaminerApi {

  private API = 'https://exam-proctor-backend-oeao.onrender.com/examiner';

  constructor(private http: HttpClient) {}

  /* ===============================
     👤 PROFILE
     =============================== */

  // Logged-in examiner profile (JWT)
  getProfile(): Observable<any> {
    return this.http.get<any>('https://exam-proctor-backend-oeao.onrender.com/auth/me');
  }

  /* ===============================
     📝 EXAMS
     =============================== */

  // Get exams created by examiner
  getMyExams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/exams`);
  }

  // Create new exam ✅ FIXED ENDPOINT
  createExam(data: {
    examName: string;
    branch: string;
    duration: number;
    totalMarks: number;
    violationLimit: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.API}/exam`, data);
  }

  // Get exam by ID
  getExamById(examId: number): Observable<any> {
    return this.http.get<any>(`${this.API}/exam/${examId}`);
  }

  // Block / Unblock exam
  updateExamStatus(examId: number, active: boolean): Observable<void> {
    return this.http.put<void>(
      `${this.API}/exam/${examId}/status?active=${active}`,
      {}
    );
  }

  // Set violation limit
  updateViolationLimit(
    examId: number,
    violationLimit: number
  ): Observable<void> {
    return this.http.put<void>(
      `${this.API}/exam/${examId}/violation-limit`,
      { violationLimit }
    );
  }

  // Set exam deadline
  updateDeadline(
    examId: number,
    deadline: string   // ISO string
  ): Observable<void> {
    return this.http.put<void>(
      `${this.API}/exam/${examId}/deadline`,
      { deadline }
    );
  }

  // 🗑️ Delete exam
deleteExam(examId: number) {
  return this.http.delete<void>(
    `${this.API}/exam/${examId}`
  );
}


  /* ===============================
     ❓ QUESTIONS
     =============================== */

  // Add question to exam
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

  // Get questions of an exam
  getQuestionsByExam(examId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.API}/exam/${examId}/questions`
    );
  }

  // Delete question
  deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API}/question/${questionId}`
    );
  }

  uploadQuestions(examId: number, formData: FormData) {
  return this.http.post(
    `${this.API}/exam/${examId}/upload-questions`,
    formData
  );
}

  /* ===============================
     📊 DASHBOARD / STATS
     =============================== */

  // Examiner dashboard stats
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.API}/stats`);
  }
}
