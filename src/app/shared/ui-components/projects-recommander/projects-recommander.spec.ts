import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsRecommander } from './projects-recommander';

describe('ProjectsRecommander', () => {
  let component: ProjectsRecommander;
  let fixture: ComponentFixture<ProjectsRecommander>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsRecommander]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsRecommander);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
