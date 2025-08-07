import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WspacePageHeader } from './wspace-page-header';

describe('WspacePageHeader', () => {
  let component: WspacePageHeader;
  let fixture: ComponentFixture<WspacePageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WspacePageHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WspacePageHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
