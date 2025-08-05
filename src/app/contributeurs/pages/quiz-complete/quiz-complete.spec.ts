import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizComplete } from './quiz-complete';

describe('QuizComplete', () => {
  let component: QuizComplete;
  let fixture: ComponentFixture<QuizComplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizComplete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizComplete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
