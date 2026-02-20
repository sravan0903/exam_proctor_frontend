import { TestBed } from '@angular/core/testing';

import { ExamSession } from './exam-session';

describe('ExamSession', () => {
  let service: ExamSession;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamSession);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
