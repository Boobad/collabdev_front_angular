import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProjetAttente } from './card-projet-attente';

describe('CardProjetAttente', () => {
  let component: CardProjetAttente;
  let fixture: ComponentFixture<CardProjetAttente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProjetAttente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProjetAttente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
