import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressionTab } from './progression-tab';

describe('ProgressionTab', () => {
  let component: ProgressionTab;
  let fixture: ComponentFixture<ProgressionTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressionTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressionTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
