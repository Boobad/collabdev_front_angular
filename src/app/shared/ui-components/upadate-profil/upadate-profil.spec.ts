import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpadateProfil } from './upadate-profil';

describe('UpadateProfil', () => {
  let component: UpadateProfil;
  let fixture: ComponentFixture<UpadateProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpadateProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpadateProfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
