import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireManager } from './questionnaire-manager';

describe('QuestionnaireManager', () => {
  let component: QuestionnaireManager;
  let fixture: ComponentFixture<QuestionnaireManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
