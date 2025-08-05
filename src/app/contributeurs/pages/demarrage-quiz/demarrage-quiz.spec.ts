import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemarrageQuiz } from './demarrage-quiz';

describe('DemarrageQuiz', () => {
  let component: DemarrageQuiz;
  let fixture: ComponentFixture<DemarrageQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemarrageQuiz],
    }).compileComponents();

    fixture = TestBed.createComponent(DemarrageQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
