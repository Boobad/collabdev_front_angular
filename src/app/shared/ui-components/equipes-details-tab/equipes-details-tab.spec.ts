import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipesDetailsTab } from './equipes-details-tab';

describe('EquipesDetailsTab', () => {
  let component: EquipesDetailsTab;
  let fixture: ComponentFixture<EquipesDetailsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipesDetailsTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipesDetailsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
