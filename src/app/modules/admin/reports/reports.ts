import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { AdminApi } from '../../../core/services/admin-api';
import Chart from 'chart.js/auto';
import { Notify } from '../../../core/services/notify';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit, AfterViewInit {

  reports: any[] = [];

  averageScore = 0;
  passPercentage = 0;

  private scoreChart: any;
  private branchChart: any;

  private platformId = inject(PLATFORM_ID);

  constructor(
    private adminApi: AdminApi,
    private notify: Notify,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReports();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {}

  loadReports(): void {
    this.adminApi.getAllResults().subscribe({
      next: (res) => {
        this.reports = res || [];
        this.calculateMetrics();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => this.renderCharts(), 200);
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.notify.error("Failed to load reports");
      }
    });
  }

  calculateMetrics(): void {
    if (!this.reports.length) return;

    const submitted = this.reports.filter(r => r.status === 'SUBMITTED');

    const totalScore = submitted.reduce(
      (sum, r) => sum + (r.score || 0), 0
    );

    const passed = submitted.filter(
      r => r.score >= 2
    ).length;

    this.averageScore = submitted.length
      ? totalScore / submitted.length
      : 0;

    this.passPercentage = submitted.length
      ? Math.round((passed / submitted.length) * 100)
      : 0;
  }

  renderCharts(): void {

    if (!this.reports.length) return;

    if (this.scoreChart) this.scoreChart.destroy();
    if (this.branchChart) this.branchChart.destroy();

    const submitted = this.reports.filter(r => r.status === 'SUBMITTED');
    const passCount = submitted.filter(r => r.score >= 2).length;
    const failCount = submitted.length - passCount;

    this.scoreChart = new Chart('scoreChart', {
      type: 'pie',
      data: {
        labels: ['Pass', 'Fail'],
        datasets: [{
          data: [passCount, failCount],
          backgroundColor: ['#22c55e', '#ef4444']
        }]
      }
    });

    // Branch-wise average
    const branchMap: Record<string, number[]> = {};

    submitted.forEach(r => {
      const branch = r.branch || 'Others';
      if (!branchMap[branch]) branchMap[branch] = [];
      branchMap[branch].push(r.score || 0);
    });

    const labels = Object.keys(branchMap);
    const averages = labels.map(
      b => branchMap[b].reduce((a, b) => a + b, 0) / branchMap[b].length
    );

    this.branchChart = new Chart('branchChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Average Score',
          data: averages,
          backgroundColor: '#4f46e5'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, max: 5 }
        }
      }
    });
  }

  exportCsv(): void {
    this.adminApi.exportCsv().subscribe(blob => {
      this.download(blob, 'exam_results.csv');
    });
  }

  exportPdf(): void {
    this.adminApi.exportPdf().subscribe(blob => {
      this.download(blob, 'exam_results.pdf');
    });
  }

  private download(blob: Blob, filename: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
