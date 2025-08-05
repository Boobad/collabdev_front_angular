import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Banniere } from './banniere';

describe('Banniere', () => {
  let component: Banniere;
  let fixture: ComponentFixture<Banniere>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Banniere]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Banniere);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
