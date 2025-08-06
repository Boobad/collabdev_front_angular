import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsBadgeDetail } from './cards-badge-detail';

describe('CardsBadgeDetail', () => {
  let component: CardsBadgeDetail;
  let fixture: ComponentFixture<CardsBadgeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsBadgeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsBadgeDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
