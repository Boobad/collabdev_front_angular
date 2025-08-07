import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesCardProject } from './mes-card-project';

describe('MesCardProject', () => {
  let component: MesCardProject;
  let fixture: ComponentFixture<MesCardProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesCardProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesCardProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
