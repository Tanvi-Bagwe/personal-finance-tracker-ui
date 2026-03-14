import { TestBed } from '@angular/core/testing';

import { ThemeServiceTs } from './theme.service.ts';

describe('ThemeServiceTs', () => {
  let service: ThemeServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
