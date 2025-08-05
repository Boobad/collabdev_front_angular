import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviterRecentTab } from './activiter-recent-tab';

describe('ActiviterRecentTab', () => {
  let component: ActiviterRecentTab;
  let fixture: ComponentFixture<ActiviterRecentTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiviterRecentTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiviterRecentTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
