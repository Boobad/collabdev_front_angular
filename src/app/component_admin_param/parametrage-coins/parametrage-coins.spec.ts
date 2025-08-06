import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrageCoins } from './parametrage-coins';

describe('ParametrageCoins', () => {
  let component: ParametrageCoins;
  let fixture: ComponentFixture<ParametrageCoins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrageCoins]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametrageCoins);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
