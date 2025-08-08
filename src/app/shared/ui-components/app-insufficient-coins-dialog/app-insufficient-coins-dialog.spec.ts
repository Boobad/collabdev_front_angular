import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInsufficientCoinsDialog } from './app-insufficient-coins-dialog';

describe('AppInsufficientCoinsDialog', () => {
  let component: AppInsufficientCoinsDialog;
  let fixture: ComponentFixture<AppInsufficientCoinsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppInsufficientCoinsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppInsufficientCoinsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
