import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { examReadyGuard } from './exam-ready-guard';

describe('examReadyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => examReadyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
