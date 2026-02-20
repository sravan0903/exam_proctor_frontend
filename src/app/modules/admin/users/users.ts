import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { AdminApi } from '../../../core/services/admin-api';
import { Notify } from '../../../core/services/notify';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];

  showModal = false;
  searchText = '';

  departments = [
    'Computer Science',
    'Information Technology',
    'Electrical Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  newUser: any = this.getEmptyUser();

  constructor(private adminApi: AdminApi,
    private notify: Notify,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ================= LOAD USERS =================
  loadUsers(): void {
    forkJoin({
      students: this.adminApi.getStudents(),
      examiners: this.adminApi.getExaminers()
    }).subscribe({
      next: ({ students, examiners }) => {
        this.users = [...students, ...examiners];
        this.filteredUsers = [...this.users]; // ✅ IMPORTANT
        this.cdr.detectChanges();
      },
      error: () => this.notify.error('Failed to load users')
    });
  }

  // ================= SEARCH =================
  filterUsers(): void {
    const text = this.searchText.toLowerCase();

    this.filteredUsers = this.users.filter(u =>
      u.name?.toLowerCase().includes(text) ||
      u.email?.toLowerCase().includes(text) ||
      u.role?.toLowerCase().includes(text) ||
      u.department?.toLowerCase().includes(text)
    );
  }

  // ================= MODAL =================
  openModal(): void {
    this.newUser = this.getEmptyUser(); // ✅ Reset every time
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  // ================= CREATE USER =================
  createUser(): void {
    // Map department → branch for backend compatibility
    const payload = {
      ...this.newUser,
      branch: this.newUser.department
    };

    this.adminApi.createUser(payload).subscribe({
      next: () => {
        this.notify.success('User created successfully');
        this.closeModal();
        this.cdr.detectChanges();
        this.loadUsers();

      },
      error: err => {
        this.notify.error(err?.error?.message || 'Failed to create user');
      }
    });
  }

  // ================= BLOCK / UNBLOCK =================
  toggleStatus(user: any): void {
    this.adminApi.updateUserStatus(user.id, !user.active)
      .subscribe({
        next: () => user.active = !user.active,
        error: () => this.notify.error('Failed to update status'),
        complete: () => this.cdr.detectChanges()
        
      });
  }

  // ================= HELPERS =================
  private getEmptyUser() {
    return {
      name: '',
      fatherName: '',
      email: '',
      password: '',
      role: 'STUDENT',
      department: '',
      collegeName: '',
      phone: ''
    };
  }
}
