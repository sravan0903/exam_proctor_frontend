import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerLayout } from './examiner-layout';

describe('ExaminerLayout', () => {
  let component: ExaminerLayout;
  let fixture: ComponentFixture<ExaminerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExaminerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
