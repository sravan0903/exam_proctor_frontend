import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPlayer } from './exam-player';

describe('ExamPlayer', () => {
  let component: ExamPlayer;
  let fixture: ComponentFixture<ExamPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamPlayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
