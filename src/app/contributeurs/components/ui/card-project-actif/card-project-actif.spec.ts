import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProjectActif } from './card-project-actif';

describe('CardProjectActif', () => {
  let component: CardProjectActif;
  let fixture: ComponentFixture<CardProjectActif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProjectActif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProjectActif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
