import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecompenseBadge } from './recompense-badge';

describe('RecompenseBadge', () => {
  let component: RecompenseBadge;
  let fixture: ComponentFixture<RecompenseBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecompenseBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecompenseBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
