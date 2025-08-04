import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsBadge } from './cards-badge';

describe('CardsBadge', () => {
  let component: CardsBadge;
  let fixture: ComponentFixture<CardsBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
