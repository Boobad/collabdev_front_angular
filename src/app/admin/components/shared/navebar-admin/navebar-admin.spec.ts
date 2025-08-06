import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavebarAdmin } from './navebar-admin';

describe('NavebarAdmin', () => {
  let component: NavebarAdmin;
  let fixture: ComponentFixture<NavebarAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavebarAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavebarAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
