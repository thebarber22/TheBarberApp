import { TestBed } from '@angular/core/testing';

import { EmployeeServiceService } from './emeployeeservice.service';

describe('ServiceService', () => {
  let service: EmployeeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
