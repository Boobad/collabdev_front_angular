import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBadges } from './card-badges';

describe('CardBadges', () => {
  let component: CardBadges;
  let fixture: ComponentFixture<CardBadges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBadges]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBadges);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
