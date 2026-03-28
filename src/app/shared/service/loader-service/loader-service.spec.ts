import { TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect } from 'vitest';

import { LoaderService } from './loader-service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService],
    });

    service = TestBed.inject(LoaderService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize isLoading as false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('show() should set isLoading to true', () => {
    service.show();

    expect(service.isLoading()).toBe(true);
  });

  it('hide() should set isLoading to false', () => {
    service.isLoading.set(true);

    service.hide();

    expect(service.isLoading()).toBe(false);
  });
});
