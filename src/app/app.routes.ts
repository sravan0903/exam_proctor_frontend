import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  { path: 'auth', loadChildren: () =>
      import('./modules/auth/auth-module').then(m => m.AuthModule)
  },

  { path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin-module').then(m => m.AdminModule),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },

  { path: 'examiner',
    loadChildren: () =>
      import('./modules/examiner/examiner-module').then(m => m.ExaminerModule),
    canActivate: [authGuard, roleGuard],
    data: { role: 'EXAMINER' }
  },

  { path: 'student',
    loadChildren: () =>
      import('./modules/student/student-module').then(m => m.StudentModule),
    canActivate: [authGuard, roleGuard],
    data: { role: 'STUDENT' }
  },
  {path: '**', redirectTo: 'auth/login', pathMatch: 'full' }

];