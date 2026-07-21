import { TestBed } from '@angular/core/testing';

import { ServiciosBase } from './servicios-base';

describe('ServiciosBase', () => {
  let service: ServiciosBase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosBase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
