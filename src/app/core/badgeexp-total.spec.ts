import { TestBed } from '@angular/core/testing';

import { BadgeexpTotal } from './badgeexp-total';

describe('BadgeexpTotal', () => {
  let service: BadgeexpTotal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BadgeexpTotal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
