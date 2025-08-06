import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceProject } from './workspace-project';

describe('WorkspaceProject', () => {
  let component: WorkspaceProject;
  let fixture: ComponentFixture<WorkspaceProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
