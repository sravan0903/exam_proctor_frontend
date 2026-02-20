import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Token } from '../../../core/services/token';
import { ExaminerApi } from '../../../core/services/examiner-api'; // optional future use

@Component({
  selector: 'app-examiner-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './examiner-layout.html',
  styleUrl: './examiner-layout.css',
})
export class ExaminerLayout implements OnInit {

  examiner = {
    name: '',
    email: ''
  };

  loading = true;

  private platformId = inject(PLATFORM_ID);

  constructor(
    private tokenService: Token,
    private router: Router,
    private examinerApi: ExaminerApi // safe to keep for later
  ) {}

  ngOnInit(): void {
    // ✅ Run only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadExaminerProfile();
    }
  }

  // ================= LOAD PROFILE =================
  loadExaminerProfile(): void {
    /**
     * TEMPORARY (SSR SAFE):
     * Using Token service instead of localStorage directly
     * Later replace with backend API (/examiner/me)
     */
    this.examiner = {
      name: this.tokenService.getRole() === 'EXAMINER'
        ? 'Examiner'
        : '',
      email: ''
    };

    this.loading = false;
  }

  // ================= LOGOUT =================
  logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/auth/login']);
  }
}
