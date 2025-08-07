import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionDetailsTab } from './discussion-details-tab';

describe('DiscussionDetailsTab', () => {
  let component: DiscussionDetailsTab;
  let fixture: ComponentFixture<DiscussionDetailsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionDetailsTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionDetailsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
