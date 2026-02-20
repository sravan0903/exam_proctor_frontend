import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ExaminerApi } from '../../../core/services/examiner-api';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.html',
  styleUrl: './questions.css',
})
export class Questions implements OnInit {

  examId!: number;
  questions: any[] = [];
  loading = false;

  selectedFile: File | null = null;

  questionForm = {
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A'
  };

  constructor(
    private route: ActivatedRoute,
    private examinerApi: ExaminerApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuestions();
    this.cdr.detectChanges();
  }

  /* ================= LOAD QUESTIONS ================= */
  loadQuestions() {
    this.loading = true;

    this.examinerApi.getQuestionsByExam(this.examId).subscribe({
      next: (res) => {
        this.questions = res || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  /* ================= FORM VALIDATION ================= */
  isFormValid(): boolean {
  return (
    this.questionForm.question.trim().length > 0 &&
    this.questionForm.optionA.trim().length > 0 &&
    this.questionForm.optionB.trim().length > 0 &&
    this.questionForm.optionC.trim().length > 0 &&
    this.questionForm.optionD.trim().length > 0
  );
}

  /* ================= ADD QUESTION ================= */
  addQuestion() {
    if (!this.isFormValid()) return;

    this.examinerApi
      .addQuestion(this.examId, this.questionForm)
      .subscribe({
        next: (newQuestion) => {
          this.resetForm();
          // 🔥 Instant UI update without reload
          this.questions.unshift(newQuestion);
          this.loadQuestions();
          this.cdr.detectChanges();
          
          
        }
      });
  }

  /* ================= DELETE QUESTION ================= */
  deleteQuestion(questionId: number) {
    if (!confirm('Delete this question?')) return;

    this.examinerApi.deleteQuestion(questionId).subscribe(() => {
      this.questions = this.questions.filter(q => q.id !== questionId);
      this.loadQuestions();
      this.cdr.detectChanges();
    });
  }

  /* ================= FILE SELECT ================= */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
  }

  /* ================= BULK UPLOAD ================= */
  uploadQuestions() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.examinerApi
      .uploadQuestions(this.examId, formData)
      .subscribe({
        next: () => {
          this.selectedFile = null;
          this.loadQuestions(); // refresh list after upload
          this.cdr.detectChanges();
        }
      });
  }

  /* ================= RESET FORM ================= */
  resetForm() {
    this.questionForm = {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    };
  }
}
