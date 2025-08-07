import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApercuTab } from './apercu-tab';

describe('ApercuTab', () => {
  let component: ApercuTab;
  let fixture: ComponentFixture<ApercuTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApercuTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApercuTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
