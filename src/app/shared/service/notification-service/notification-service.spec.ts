import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { NotificationService } from './notification-service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: {
    open: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    const snackBarMock = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: MatSnackBar, useValue: snackBarMock }],
    });

    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar) as any;
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('show() should open snackbar with message', () => {
    service.show('success', 'Test message');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Test message',
      'x',
      expect.objectContaining({
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snack-success'],
      }),
    );
  });

  it('show() should use default type as info', () => {
    service.show('info', 'Info message');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Info message',
      'x',
      expect.objectContaining({
        panelClass: ['snack-info'],
      }),
    );
  });

  it('show() should hide close button when showClose is false', () => {
    service.show('error', 'Error message', 3000, false);

    expect(snackBar.open).toHaveBeenCalledWith('Error message', '', expect.anything());
  });

  it('show() should set infinite duration when duration is 0', () => {
    service.show('warn', 'Warning message', 0);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Warning message',
      'x',
      expect.objectContaining({
        duration: undefined,
      }),
    );
  });
});
