import { TestBed } from '@angular/core/testing';

import { Proctor } from './proctor';

describe('Proctor', () => {
  let service: Proctor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Proctor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
