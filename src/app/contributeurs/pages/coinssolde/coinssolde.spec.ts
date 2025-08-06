import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coinssolde } from './coinssolde';

describe('Coinssolde', () => {
  let component: Coinssolde;
  let fixture: ComponentFixture<Coinssolde>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coinssolde]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coinssolde);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
