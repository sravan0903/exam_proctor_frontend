import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { StudentApi } from '../../../core/services/student-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-results',
  imports: [CommonModule, FormsModule],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit{

   results: any[] = [];
  filteredResults: any[] = [];

  searchText = '';
  loading = false;

   constructor(private studentApi: StudentApi,
    private cdr:ChangeDetectorRef
   ) {}
  ngOnInit(): void {
    this.loadResults();
  }

    loadResults() {
    this.studentApi.getMyResults().subscribe({
      next: (res) => {
        this.results = res;
        this.filteredResults = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🔍 Search by exam name or status
 filterResults() {
  const text = this.searchText.toLowerCase();

  this.filteredResults = this.results.filter(r =>
    r.examName?.toLowerCase().includes(text) ||
    r.status?.toLowerCase().includes(text)
  );
}


  // 📊 Percentage calculation
  getPercentage(score: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((score / total) * 100);
  }

}
