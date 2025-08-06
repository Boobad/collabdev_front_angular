import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetsRecommandes } from './projets-recommandes';

describe('ProjetsRecommandes', () => {
  let component: ProjetsRecommandes;
  let fixture: ComponentFixture<ProjetsRecommandes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetsRecommandes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetsRecommandes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
