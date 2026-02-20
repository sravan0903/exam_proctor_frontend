import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ExaminerApi } from '../../../core/services/examiner-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  loading = true;

  stats = {
    totalExams: 0,
    activeExams: 0,
    totalQuestions: 0
  };

  recentExams: any[] = [];

  constructor(
    private examinerApi: ExaminerApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {

    this.examinerApi.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.cdr.detectChanges();
      }
    });

    this.examinerApi.getMyExams().subscribe({
      next: (exams) => {
        this.recentExams = exams
          .sort((a: any, b: any) =>
            new Date(b.deadline).getTime() -
            new Date(a.deadline).getTime()
          )
          .slice(0, 5);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  isExpired(deadline: string): boolean {
    return new Date(deadline).getTime() < Date.now();
  }
}
