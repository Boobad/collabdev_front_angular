import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailProjet } from './admin-detail-projet';

describe('AdminDetailProjet', () => {
  let component: AdminDetailProjet;
  let fixture: ComponentFixture<AdminDetailProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDetailProjet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDetailProjet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
