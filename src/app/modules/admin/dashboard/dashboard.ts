import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminApi } from '../../../core/services/admin-api';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats = {
    students: 0,
    examiners: 0,
    exams: 0,
    violations: 0
  };

  constructor(private adminApi: AdminApi,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.adminApi.getStudents().subscribe(res => {
      this.stats.students = res.length;
      this.cdr.detectChanges();
    });

    this.adminApi.getExaminers().subscribe(res => {
      this.stats.examiners = res.length;
      this.cdr.detectChanges();
    });

    this.adminApi.getAllResults().subscribe(res => {
      this.stats.exams = new Set(res.map(r => r.exam.id)).size;
      this.cdr.detectChanges();
    });

    this.adminApi.getViolations().subscribe(res => {
      this.stats.violations = res.length;
      this.cdr.detectChanges();
    });
  }

}
