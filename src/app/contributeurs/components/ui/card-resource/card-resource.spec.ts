import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardResource } from './card-resource';

describe('CardResource', () => {
  let component: CardResource;
  let fixture: ComponentFixture<CardResource>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardResource]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardResource);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
