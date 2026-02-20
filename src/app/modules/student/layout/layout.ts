import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Token } from '../../../core/services/token';
import { StudentApi } from '../../../core/services/student-api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {

  student = {
    name: '',
    email: '',
    branch: ''
  };

  loading = false;

  private platformId = inject(PLATFORM_ID);

  constructor(
    private tokenService: Token,
    private router: Router,
    private studentApi: StudentApi
  ) {}

  ngOnInit(): void {
    // Only call API in browser (SSR safe)
    if (isPlatformBrowser(this.platformId)) {
      this.loadStudentProfile();
    }
  }

  // ================= LOAD PROFILE =================
  loadStudentProfile(): void {
    this.studentApi.getProfile().subscribe({
      next: (res) => {
        this.student = {
          name: res.name,
          email: res.email,
          branch: res.branch
        };
        this.loading = false;
      },
      error: () => {
        this.logout();
      }
    });
  }

  // ================= LOGOUT =================
  logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/auth/login']);
  }
}
