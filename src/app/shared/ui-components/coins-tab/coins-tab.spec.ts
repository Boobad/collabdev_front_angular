import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsTab } from './coins-tab';

describe('CoinsTab', () => {
  let component: CoinsTab;
  let fixture: ComponentFixture<CoinsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinsTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
