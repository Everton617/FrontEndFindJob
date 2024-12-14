import { TestBed } from '@angular/core/testing';

import { CompanyAuthGuardService } from './company-auth-guard.service';

describe('CompanyAuthGuardService', () => {
  let service: CompanyAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
