import { TestBed } from '@angular/core/testing';

import { ExaminerApi } from './examiner-api';

describe('ExaminerApi', () => {
  let service: ExaminerApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExaminerApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
