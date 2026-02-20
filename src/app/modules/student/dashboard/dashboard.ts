import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentApi } from '../../../core/services/student-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

    student: any = null;

  totalExams = 0;
  pendingExams = 0;
  completedExams = 0;

  loading = false;

  constructor(private studentApi: StudentApi,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

   loadDashboardData() {
    // 1️⃣ Load profile
    this.studentApi.getProfile().subscribe(profile => {
      this.student = profile;
      this.cdr.detectChanges();
    });

    // 2️⃣ Load exams (branch-based)
    this.studentApi.getAvailableExams().subscribe(exams => {
      this.totalExams = exams.length;

      // 3️⃣ Load attempts to calculate pending vs completed
      this.studentApi.getMyResults().subscribe(attempts => {
        const attemptedExamIds = attempts
            .filter(a => a?.examId)
            .map(a => a.examId);

        this.completedExams = attempts.length;
        this.pendingExams = exams.filter(
          e => !attemptedExamIds.includes(e.id)
        ).length;

        this.loading = false;
        this.cdr.detectChanges();
      });
      this.cdr.detectChanges();
    });
  }
}
