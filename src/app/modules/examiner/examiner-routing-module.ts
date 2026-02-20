import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Exams } from './exams/exams';
import { Dashboard } from './dashboard/dashboard';
import { Questions } from './questions/questions';
import { ExaminerLayout } from './examiner-layout/examiner-layout';
import { CreateExam } from './create-exam/create-exam';

const routes: Routes = [
 {
  path: '',
  component: ExaminerLayout,
  children: [
    { path: 'dashboard', component: Dashboard },
    { path: 'exams', component: Exams },
    { path: 'create-exam', component: CreateExam },
    {path: 'questions/:id',component: Questions},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminerRoutingModule { }
