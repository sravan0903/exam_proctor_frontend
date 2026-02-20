import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminApi {
   private API = 'https://exam-proctor-backend-oeao.onrender.com/admin';

  constructor(private http: HttpClient) {}

  // 👥 USERS
  createUser(data: any): Observable<any> {
    return this.http.post(`${this.API}/create-user`, data);
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/students`);
  }

  getExaminers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/examiners`);
  }

  // 📊 REPORTS
  getAllResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/reports/results`);
  }

  getViolations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/reports/violations`);
  }

  // 📥 EXPORTS
  exportCsv() {
    return this.http.get(`${this.API}/reports/export/csv`, {
      responseType: 'blob'
    });
  }

  exportPdf() {
    return this.http.get(`${this.API}/reports/export/pdf`, {
      responseType: 'blob'
    });
  }

  updateUserStatus(userId: number, active: boolean): Observable<any> {
  return this.http.put(
    `${this.API}/user/${userId}/status?active=${active}`,
    {}
  );
}
}
