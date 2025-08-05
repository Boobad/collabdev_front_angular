import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizProcess } from './quiz-process';

describe('QuizProcess', () => {
  let component: QuizProcess;
  let fixture: ComponentFixture<QuizProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizProcess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizProcess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
