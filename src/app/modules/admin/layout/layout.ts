import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Token } from '../../../core/services/token';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  constructor(
    private tokenService: Token,
    private router: Router
  ) {}

  logout() {
    // Clear auth data
    this.tokenService.clear();
    

    // Redirect to login
    this.router.navigate(['/auth/login']);
  }
}
