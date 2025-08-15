import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAdminLayout } from './main-admin-layout';

describe('MainAdminLayout', () => {
  let component: MainAdminLayout;
  let fixture: ComponentFixture<MainAdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainAdminLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainAdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
