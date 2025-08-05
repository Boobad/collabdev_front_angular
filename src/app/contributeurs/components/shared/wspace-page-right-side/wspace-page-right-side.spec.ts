import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WspacePageRightSide } from './wspace-page-right-side';

describe('WspacePageRightSide', () => {
  let component: WspacePageRightSide;
  let fixture: ComponentFixture<WspacePageRightSide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WspacePageRightSide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WspacePageRightSide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
