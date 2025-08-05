import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumerProjet } from './resumer-projet';

describe('ResumerProjet', () => {
  let component: ResumerProjet;
  let fixture: ComponentFixture<ResumerProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumerProjet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumerProjet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
