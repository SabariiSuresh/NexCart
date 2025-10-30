import { TestBed } from '@angular/core/testing';

import { Feature } from './feature';

describe('Feature', () => {
  let service: Feature;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Feature);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
