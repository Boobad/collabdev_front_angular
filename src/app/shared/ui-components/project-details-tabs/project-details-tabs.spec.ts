import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsTabs } from './project-details-tabs';

describe('ProjectDetailsTabs', () => {
  let component: ProjectDetailsTabs;
  let fixture: ComponentFixture<ProjectDetailsTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
