import { TestBed } from '@angular/core/testing';

import { HttpCallerService } from './http-caller.service';

describe('HttpCallerService', () => {
  let service: HttpCallerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCallerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
