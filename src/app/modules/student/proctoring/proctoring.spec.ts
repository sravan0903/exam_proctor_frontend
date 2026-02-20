import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proctoring } from './proctoring';

describe('Proctoring', () => {
  let component: Proctoring;
  let fixture: ComponentFixture<Proctoring>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proctoring]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Proctoring);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
