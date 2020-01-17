import { TestBed } from '@angular/core/testing';

import { StateService } from './state.service';
import { CookieStorage } from '../storage';
import { Config } from '../../config';

describe('StateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Config,
      CookieStorage,
    ]
  }));

  it('should be created', () => {
    const service: StateService = TestBed.get(StateService);
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    const service: StateService = TestBed.get(StateService);
    expect(service).toBeTruthy();
  });
});
