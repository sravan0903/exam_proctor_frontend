import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentApi } from './../../../core/services/student-api';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ExamSession } from '../../../core/services/exam-session';

@Component({
  selector: 'app-exam-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-player.html',
  styleUrl: './exam-player.css',
})
export class ExamPlayer implements OnInit, OnDestroy {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  exam: any;
  questions: any[] = [];
  currentIndex = 0;

  remainingSeconds = 0;
  timerInterval: any;

  warnings: string[] = [];
  violationLimit = 3;

  loading = true;
  examStarted = false;

  private canvas!: HTMLCanvasElement;
  private aiInterval: any;

  private readonly AI_URL = 'https://exam-proctor-ai-jbgb.onrender.com/analyze-frame';
  private readonly AI_INTERVAL_MS = 2000;

  // 🔥 prevents multiple submissions
  private examCompleted = false;

  constructor(
    private route: ActivatedRoute,
    private examSession: ExamSession,
    private router: Router,
    private studentApi: StudentApi,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /* =============================
     LIFECYCLE
     ============================= */

  ngOnInit(): void {
    const examId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(examId)) {
      this.router.navigate(['/student/exams']);
      return;
    }

    this.loadExam(examId);
  }

  ngOnDestroy(): void {
    this.cleanupProctoring();
    this.examSession.clear();
  }

  /* =============================
     LOAD EXAM
     ============================= */

  loadExam(examId: number) {
    this.studentApi.getExamForPlayer(examId).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.questions = exam.questions ?? [];
        this.violationLimit = exam.violationLimit ?? 3;
        this.remainingSeconds = (exam.duration ?? 0) * 60;

        this.examStarted = true;
        this.loading = false;

        this.startTimer();

        if (isPlatformBrowser(this.platformId)) {
          this.initWebcam();
          this.startFocusMonitoring();
        }

        this.cdr.detectChanges();
      },
      error: () => {
        alert('Unable to load exam');
        this.router.navigate(['/student/exams']);
      }
    });
  }

  /* =============================
     TIMER
     ============================= */

  startTimer() {
    this.timerInterval = setInterval(() => {

      if (this.examCompleted) {
        clearInterval(this.timerInterval);
        return;
      }

      this.remainingSeconds--;
      this.cdr.detectChanges();

      if (this.remainingSeconds <= 0) {
        this.autoSubmit('TIME_EXCEEDED');
      }

    }, 1000);
  }

  get timeLeft(): string {
    const min = Math.floor(this.remainingSeconds / 60);
    const sec = this.remainingSeconds % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  /* =============================
     QUESTIONS
     ============================= */

  get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  goToQuestion(index: number) {
    this.currentIndex = index;
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  saveAnswer(question: any, option: string) {
    question.selected = option;

    this.studentApi.saveAnswer({
      examId: this.exam.id,
      questionId: question.questionId,
      selectedAnswer: option
    }).subscribe();
  }

  /* =============================
     SUBMISSION
     ============================= */

  submitExam() {

    if (this.examCompleted) return;

    if (!confirm('Are you sure you want to submit the exam?')) return;

    this.examCompleted = true;
    this.examStarted = false;

    this.cleanupProctoring();

    this.studentApi.submitExam(this.exam.id).subscribe(() => {
      alert('Exam submitted successfully');
      this.router.navigate(['/student/results']);
    });
  }

  autoSubmit(reason: string) {

    if (this.examCompleted) return;

    this.examCompleted = true;
    this.examStarted = false;

    alert(`Exam auto-submitted: ${reason}`);

    this.cleanupProctoring();

    this.studentApi.submitExam(this.exam.id).subscribe(() => {
      this.router.navigate(['/student/results']);
    });
  }

  /* =============================
     PROCTORING (BROWSER)
     ============================= */

  registerViolation(type: string) {

    if (!this.examStarted || this.examCompleted) return;

    this.warnings.push(type.replace('_', ' '));

    if (this.warnings.length >= this.violationLimit) {
      this.autoSubmit('VIOLATION_LIMIT_EXCEEDED');
    }

    this.cdr.detectChanges();
  }

  @HostListener('document:visibilitychange')
  onTabSwitch() {
    if (document.hidden) {
      this.registerViolation('TAB_SWITCH');
    }
  }

  @HostListener('window:blur')
  onBlur() {
    this.registerViolation('WINDOW_BLUR');
  }

  startFocusMonitoring() {
    document.body.oncopy = () => false;
    document.body.onpaste = () => false;
  }

  /* =============================
     AI PROCTORING
     ============================= */

  startAIProctoring() {

    if (!this.examStarted || this.examCompleted) return;

    if (this.aiInterval) {
      clearInterval(this.aiInterval);
    }

    this.canvas = document.createElement('canvas');

    this.aiInterval = setInterval(() => {
      this.captureFrame();
    }, this.AI_INTERVAL_MS);

    console.log('AI Proctoring Started');
  }

  captureFrame() {

    if (!this.video?.nativeElement || !this.examStarted || this.examCompleted) return;

    const video = this.video.nativeElement;

    if (video.readyState < 2) return;

    this.canvas.width = video.videoWidth;
    this.canvas.height = video.videoHeight;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);

    this.canvas.toBlob(blob => {
      if (blob) {
        this.sendFrameToAI(blob);
      }
    }, 'image/jpeg');
  }

  sendFrameToAI(blob: Blob) {

    const email = this.examSession.getStudentEmail();
    if (!email) return;

    const formData = new FormData();
    formData.append('studentEmail', email);
    formData.append('file', blob, 'frame.jpg');

    this.studentApi.sendFrameToAI(this.AI_URL, formData).subscribe({
      next: (res: any) => this.handleAIResponse(res),
      error: () => {}
    });
  }

  handleAIResponse(res: any) {
    if (!res?.violation) return;
    this.registerViolation(res.violation);
  }

  /* =============================
     WEBCAM
     ============================= */

  initWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {

        const videoEl = this.video.nativeElement;
        videoEl.srcObject = stream;

        videoEl.onloadedmetadata = () => {
          videoEl.play();
          this.startAIProctoring();
        };

      })
      .catch(() => {
        alert('Webcam access is mandatory');
        this.router.navigate(['/student/exams']);
      });
  }

  /* =============================
     CLEANUP
     ============================= */

  cleanupProctoring() {

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.aiInterval) {
      clearInterval(this.aiInterval);
      this.aiInterval = null;
    }

    const videoEl = this.video?.nativeElement;

    if (videoEl && videoEl.srcObject) {
      const stream = videoEl.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoEl.srcObject = null;
    }

    console.log('Proctoring cleaned up');
  }
}
