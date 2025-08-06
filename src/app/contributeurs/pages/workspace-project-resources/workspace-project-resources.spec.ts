import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceProjectResources } from './workspace-project-resources';

describe('WorkspaceProjectResources', () => {
  let component: WorkspaceProjectResources;
  let fixture: ComponentFixture<WorkspaceProjectResources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceProjectResources]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceProjectResources);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
