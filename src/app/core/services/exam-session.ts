import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ExamSession {

  private readonly READY_KEY = 'exam_ready';
  private readonly EMAIL_KEY = 'student_email';

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /* =============================
     EXAM READY FLAG
     ============================= */

  setReady() {
    if (this.isBrowser) {
      sessionStorage.setItem(this.READY_KEY, 'true');
    }
  }

  isReady(): boolean {
    if (!this.isBrowser) return false;
    return sessionStorage.getItem(this.READY_KEY) === 'true';
  }

  /* =============================
     STUDENT EMAIL (AI + PROCTORING)
     ============================= */

  setStudentEmail(email: string) {
    if (this.isBrowser && email) {
      sessionStorage.setItem(this.EMAIL_KEY, email);
    }
  }

  getStudentEmail(): string {
    if (!this.isBrowser) return '';
    return sessionStorage.getItem(this.EMAIL_KEY) || '';
  }

  /* =============================
     CLEAR SESSION
     ============================= */

  clear() {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.READY_KEY);
      sessionStorage.removeItem(this.EMAIL_KEY);
    }
  }
}
