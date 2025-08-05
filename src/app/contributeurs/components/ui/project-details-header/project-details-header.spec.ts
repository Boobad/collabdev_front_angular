import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsHeader } from './project-details-header';

describe('ProjectDetailsHeader', () => {
  let component: ProjectDetailsHeader;
  let fixture: ComponentFixture<ProjectDetailsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
