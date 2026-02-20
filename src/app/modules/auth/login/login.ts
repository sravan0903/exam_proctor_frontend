import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Token } from '../../../core/services/token';
import { ExamSession } from '../../../core/services/exam-session';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  errorMessage = '';
  loginForm: any;
  showPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private tokenService: Token,
    private examSession: ExamSession,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;

        // 🔐 Save JWT
        this.tokenService.saveToken(res.token);

        // 🔥 Decode from JWT (single source of truth)
        const role = this.tokenService.getRole();
        const email = this.tokenService.getEmail();

        // 🧠 Store session data for exam + AI
        this.examSession.setStudentEmail(email);
        this.examSession.setReady();

        // 🚦 Route by role
        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'EXAMINER') {
          this.router.navigate(['/examiner']);
        } else if (role === 'STUDENT') {
          this.router.navigate(['/student']);
        } else {
          // Safety fallback
          this.tokenService.clear();
          this.examSession.clear();
          this.errorMessage = 'Invalid role';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Login failed';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  scrollToRegister() {
    document.getElementById('register')?.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
