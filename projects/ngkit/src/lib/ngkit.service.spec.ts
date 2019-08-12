import { TestBed } from '@angular/core/testing';

import { NgkitService } from './ngkit.service';

describe('NgkitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgkitService = TestBed.get(NgkitService);
    expect(service).toBeTruthy();
  });
});
