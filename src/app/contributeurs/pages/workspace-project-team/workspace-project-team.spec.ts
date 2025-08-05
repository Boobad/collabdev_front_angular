import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceProjectTeam } from './workspace-project-team';

describe('WorkspaceProjectTeam', () => {
  let component: WorkspaceProjectTeam;
  let fixture: ComponentFixture<WorkspaceProjectTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceProjectTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceProjectTeam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
