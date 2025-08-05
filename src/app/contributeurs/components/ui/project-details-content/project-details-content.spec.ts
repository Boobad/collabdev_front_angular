import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsContent } from './project-details-content';

describe('ProjectDetailsContent', () => {
  let component: ProjectDetailsContent;
  let fixture: ComponentFixture<ProjectDetailsContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
