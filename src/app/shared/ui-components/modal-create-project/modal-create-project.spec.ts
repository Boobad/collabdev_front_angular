import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateProject } from './modal-create-project';

describe('ModalCreateProject', () => {
  let component: ModalCreateProject;
  let fixture: ComponentFixture<ModalCreateProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
