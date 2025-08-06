import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitContribution } from './submit-contribution';

describe('SubmitContribution', () => {
  let component: SubmitContribution;
  let fixture: ComponentFixture<SubmitContribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitContribution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitContribution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
