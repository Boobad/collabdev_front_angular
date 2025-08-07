import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPages } from './details-pages';

describe('DetailsPages', () => {
  let component: DetailsPages;
  let fixture: ComponentFixture<DetailsPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
