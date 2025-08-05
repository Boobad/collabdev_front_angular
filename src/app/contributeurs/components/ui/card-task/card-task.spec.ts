import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTask } from './card-task';

describe('CardTask', () => {
  let component: CardTask;
  let fixture: ComponentFixture<CardTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
