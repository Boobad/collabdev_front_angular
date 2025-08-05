import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachesTab } from './taches-tab';

describe('TachesTab', () => {
  let component: TachesTab;
  let fixture: ComponentFixture<TachesTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TachesTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TachesTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
