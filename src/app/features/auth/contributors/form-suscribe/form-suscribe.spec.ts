import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSuscribe } from './form-suscribe';

describe('FormSuscribe', () => {
  let component: FormSuscribe;
  let fixture: ComponentFixture<FormSuscribe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSuscribe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSuscribe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
