import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExaminerApi } from '../../../core/services/examiner-api';

/* ===============================
   INTERFACES (CLEAN & SAFE)
   =============================== */
interface Exam {
  id: number;
  examName: string;
  branch: string;
  duration: number;
  totalMarks: number;
  violationLimit: number;
  deadline: string; // yyyy-MM-ddTHH:mm
}

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams implements OnInit {

  exams: Exam[] = [];
  loading = false;
  showCreateModal = false;
  errorMessage = '';

  branches = [
    'Computer Science',
    'Information Technology',
    'Electrical Engineering',
    'Mechanical Engineering'
  ];

  examForm: Omit<Exam, 'id'> = {
    examName: '',
    branch: '',
    duration: 60,
    totalMarks: 100,
    violationLimit: 3,
    deadline: ''
  };

  constructor(
    private examinerApi: ExaminerApi,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  /* ===============================
     LOAD EXAMS
     =============================== */
  loadExams(): void {
    this.loading = true;

    this.examinerApi.getMyExams().subscribe({
      next: (res: Exam[]) => {
        this.exams = (res || []).map(e => ({
          ...e,
          // 🔥 Required for datetime-local input
          deadline: e.deadline ? e.deadline.substring(0, 16) : ''
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load exams';
        this.loading = false;
      }
    });
  }

  /* ===============================
     CREATE EXAM
     =============================== */
  createExam(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const payload = {
      ...this.examForm,
      deadline: this.examForm.deadline.trim()
    };

    this.examinerApi.createExam(payload).subscribe({
      next: () => {
        this.closeCreateModal();
        this.cdr.detectChanges();
        this.loadExams(); // refresh list
      },
      error: () => {
        this.errorMessage = 'Failed to create exam';
      }
    });
  }

  /* ===============================
     UPDATE DEADLINE
     =============================== */
  updateDeadline(exam: Exam): void {
    if (!exam.deadline) return;

    this.examinerApi.updateDeadline(exam.id, exam.deadline).subscribe({
      next:()=>{
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to update deadline';
      }
    });
  }

  /* ===============================
     UPDATE VIOLATION LIMIT
     =============================== */
  updateViolations(exam: Exam): void {
    this.examinerApi
      .updateViolationLimit(exam.id, exam.violationLimit)
      .subscribe({
        error: () => {
          this.errorMessage = 'Failed to update violation limit';
        }
      });
  }

  /* ===============================
     NAVIGATE TO QUESTIONS
     =============================== */
  goToQuestions(examId: number): void {
    this.router.navigate(['/examiner/questions', examId]);
  }

  /* ===============================
     MODAL HELPERS
     =============================== */
  openCreateModal(): void {
    this.resetForm();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  resetForm(): void {
    this.examForm = {
      examName: '',
      branch: '',
      duration: 60,
      totalMarks: 100,
      violationLimit: 3,
      deadline: ''
    };
    this.errorMessage = '';
  }

  isFormValid(): boolean {
    return !!(
      this.examForm.examName &&
      this.examForm.branch &&
      this.examForm.duration &&
      this.examForm.deadline
    );
  }

  // 🗑️ Delete Exam
deleteExam(exam: any) {

  const confirmDelete = confirm(
    `Are you sure you want to delete the exam "${exam.examName}"?\n\nThis action cannot be undone.`
  );

  if (!confirmDelete) return;

  this.examinerApi.deleteExam(exam.id).subscribe({
    next: () => {
      this.exams = this.exams.filter(e => e.id !== exam.id);
      this.cdr.detectChanges();
    },
    error: (err) => {
      alert(err.error?.message || 'Unable to delete exam');
    }
  });
}

}
