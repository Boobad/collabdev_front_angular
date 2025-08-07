import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetAdmin } from './projet-admin';

describe('ProjetAdmin', () => {
  let component: ProjetAdmin;
  let fixture: ComponentFixture<ProjetAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
