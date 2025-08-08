import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBadge } from './admin-badge';

describe('AdminBadge', () => {
  let component: AdminBadge;
  let fixture: ComponentFixture<AdminBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
