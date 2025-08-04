import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutProjet } from './ajout-projet';

describe('AjoutProjet', () => {
  let component: AjoutProjet;
  let fixture: ComponentFixture<AjoutProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutProjet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutProjet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
