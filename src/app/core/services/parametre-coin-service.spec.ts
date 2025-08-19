import { TestBed } from '@angular/core/testing';

import { ParametreCoinService } from './parametre-coin-service';

describe('ParametreCoinService', () => {
  let service: ParametreCoinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametreCoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
