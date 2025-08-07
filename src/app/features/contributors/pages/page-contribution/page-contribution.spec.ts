import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContribution } from './page-contribution';

describe('PageContribution', () => {
  let component: PageContribution;
  let fixture: ComponentFixture<PageContribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContribution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageContribution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
