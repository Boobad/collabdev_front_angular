import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireParticipation } from './formulaire-participation';

describe('FormulaireParticipation', () => {
  let component: FormulaireParticipation;
  let fixture: ComponentFixture<FormulaireParticipation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireParticipation],
    }).compileComponents();

    fixture = TestBed.createComponent(FormulaireParticipation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
