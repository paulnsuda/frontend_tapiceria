import { TestBed } from '@angular/core/testing';

import { Proformas } from './proformas';

describe('Proformas', () => {
  let service: Proformas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Proformas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
