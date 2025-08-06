import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDemandeParticipation } from './liste-demande-participation';

describe('ListeDemandeParticipation', () => {
  let component: ListeDemandeParticipation;
  let fixture: ComponentFixture<ListeDemandeParticipation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeDemandeParticipation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeDemandeParticipation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
