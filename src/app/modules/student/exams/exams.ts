import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentApi } from '../../../core/services/student-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exams',
  imports: [CommonModule],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams implements OnInit {

   exams: any[] = [];
  attempts: any[] = [];
  loading = false;

   constructor(
    private studentApi: StudentApi,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
     this.loadExams();
  }
   loadExams() {
    this.studentApi.getAvailableExams().subscribe(exams => {
      this.studentApi.getMyResults().subscribe(attempts => {
        this.attempts = attempts;

        // Mark exams as attempted or not
        this.exams = exams.map(exam => {
          const attempt = attempts.find(a => a.examId === exam.id); 
          return {
            ...exam,
            attempted: !!attempt,
            score: attempt?.score,
            status: attempt?.status ?? 'NOT_ATTEMPTED'
          };
        });

        this.loading = false;
        this.cdr.detectChanges();
      });
    });
  }

  // ▶ Start Exam
  takeTest(examId: number) {
  
  this.router.navigate(['/student/instructions', examId]);
}


  // 📊 View Result
  viewResult(examId: number) {
    this.router.navigate(['/student/results'], {
      queryParams: { examId }
    });
  }

}
