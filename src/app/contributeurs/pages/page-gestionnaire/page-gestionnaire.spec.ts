import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageGestionnaire } from './page-gestionnaire';

describe('PageGestionnaire', () => {
  let component: PageGestionnaire;
  let fixture: ComponentFixture<PageGestionnaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageGestionnaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageGestionnaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
