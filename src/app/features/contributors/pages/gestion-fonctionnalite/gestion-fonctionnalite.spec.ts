import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFonctionnalite } from './gestion-fonctionnalite';

describe('GestionFonctionnalite', () => {
  let component: GestionFonctionnalite;
  let fixture: ComponentFixture<GestionFonctionnalite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionFonctionnalite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionFonctionnalite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
