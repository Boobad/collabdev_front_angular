import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireManagement } from './questionnaire-management';

describe('QuestionnaireManagement', () => {
  let component: QuestionnaireManagement;
  let fixture: ComponentFixture<QuestionnaireManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
