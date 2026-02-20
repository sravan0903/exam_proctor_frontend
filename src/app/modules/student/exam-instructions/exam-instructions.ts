import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

import { ExamSession } from '../../../core/services/exam-session';
import { StudentApi } from '../../../core/services/student-api';
import { API_URL, AI_URL } from '../../../core/services/app.tokens';

@Component({
  selector: 'app-exam-instructions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-instructions.html',
  styleUrl: './exam-instructions.css',
})
export class ExamInstructions implements OnInit {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  examId!: number;

  declarationAccepted = false;
  cameraGranted = false;
  checkingCamera = false;

  faceRegistered = false;
  registeringFace = false;

  // ✅ Declare but don’t initialize here
  private aiRegisterUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examSession: ExamSession,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private studentApi: StudentApi,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(API_URL) private apiUrl: string,
    @Inject(AI_URL) private aiUrl: string
  ) {
    // ✅ Now injection is available
    this.aiRegisterUrl = `${this.aiUrl}/register-face`;
  }

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
  }

  /* =============================
     CAMERA PERMISSION
     ============================= */
  async allowCamera() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.checkingCamera = true;
    this.cdr.detectChanges();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = stream;
      this.cameraGranted = true;
      this.cdr.detectChanges();
    } catch {
      alert('Camera permission is mandatory to attend the exam');
    } finally {
      this.checkingCamera = false;
    }
  }

  /* =============================
     FACE REGISTRATION
     ============================= */
  registerFace() {

    if (!this.cameraGranted) return;

    const email = this.examSession.getStudentEmail();
    if (!email) {
      alert('Session expired. Please login again.');
      return;
    }

    this.registeringFace = true;

    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('studentEmail', email);
      formData.append('file', blob, 'face.jpg');

      this.http.post(this.aiRegisterUrl, formData).subscribe({
        next: () => {
          this.faceRegistered = true;
        },
        error: () => {
          alert('Face registration failed. Try again.');
        },
        complete: () => {
          this.registeringFace = false;
        }
      });

    }, 'image/jpeg');
  }

  /* =============================
     START EXAM
     ============================= */
  startExam() {

    if (!this.declarationAccepted) {
      alert('Please accept the declaration');
      return;
    }

    if (!this.cameraGranted) {
      alert('Please allow camera permission');
      return;
    }

    if (!this.faceRegistered) {
      alert('Please register your face');
      return;
    }

    this.studentApi.startExam(this.examId).subscribe({
      next: () => {
        this.examSession.setReady();
        this.router.navigate(['/student/exam-player', this.examId]);
      },
      error: (err) => {
        alert(err.error?.message || 'Unable to start exam');
      }
    });
  }
}
