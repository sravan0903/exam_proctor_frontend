import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Exams } from './exams/exams';
import { Dashboard } from './dashboard/dashboard';
import { ExamPlayer } from './exam-player/exam-player';
import { Results } from './results/results';
import { Layout } from './layout/layout';
import { ExamInstructions } from './exam-instructions/exam-instructions';
import { examReadyGuard } from '../../core/guards/exam-ready-guard';
import { Proctoring } from './proctoring/proctoring';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'exams', component: Exams },
      { path: 'results', component: Results },
      { path: 'instructions/:id', component: ExamInstructions },
      { path: 'exam-player/:id', component: ExamPlayer,canActivate: [examReadyGuard] },
      { path: 'proctoring', component:Proctoring},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
