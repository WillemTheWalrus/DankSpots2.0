import { TestBed } from '@angular/core/testing';

import { AuthFormValidatorsService } from './auth-form-validators.service';

describe('AuthFormValidatorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthFormValidatorsService = TestBed.get(AuthFormValidatorsService);
    expect(service).toBeTruthy();
  });
});
