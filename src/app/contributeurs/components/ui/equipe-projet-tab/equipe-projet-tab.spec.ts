import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipeProjetTab } from './equipe-projet-tab';

describe('EquipeProjetTab', () => {
  let component: EquipeProjetTab;
  let fixture: ComponentFixture<EquipeProjetTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipeProjetTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipeProjetTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
