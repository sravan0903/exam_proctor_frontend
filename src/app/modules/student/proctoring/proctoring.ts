import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proctoring',
  imports: [FormsModule, CommonModule],
  templateUrl: './proctoring.html',
  styleUrl: './proctoring.css',
})
export class Proctoring implements OnInit {
  
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  violation: string | null = null;

  studentEmail = 'sravan@exam.com';   // later from login/session
  AI_URL = 'http://localhost:8001/analyze-frame';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startWebcam();
  }

  startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.startFrameCapture();
      })
      .catch(err => {
        console.error('Webcam error', err);
      });
  }

  startFrameCapture() {
    // Capture frame every 2 seconds
    setInterval(() => {
      this.captureAndSendFrame();
    }, 2000);
  }

  captureAndSendFrame() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) {
        this.sendFrameToAI(blob);
      }
    }, 'image/jpeg');
  }

  sendFrameToAI(blob: Blob) {
    const formData = new FormData();
    formData.append('studentEmail', this.studentEmail);
    formData.append('file', blob, 'frame.jpg');
    

    this.http.post<any>(this.AI_URL, formData)
      .subscribe({
        next: (res) => {
          console.log('AI Response', res);
          this.violation = res.violation;
        },
        error: (err) => {
          console.error('AI error', err);
        }
      });
  }


}
