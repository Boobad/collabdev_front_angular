import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeuilBadge } from './ceuil-badge';

describe('CeuilBadge', () => {
  let component: CeuilBadge;
  let fixture: ComponentFixture<CeuilBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CeuilBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeuilBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
