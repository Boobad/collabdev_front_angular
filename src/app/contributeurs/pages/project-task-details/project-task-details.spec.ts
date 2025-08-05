import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskDetails } from './project-task-details';

describe('ProjectTaskDetails', () => {
  let component: ProjectTaskDetails;
  let fixture: ComponentFixture<ProjectTaskDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTaskDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTaskDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
