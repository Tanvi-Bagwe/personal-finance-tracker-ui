import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

// Notification service - displays toast messages to user
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  // Show notification with specified type, message and duration
  show(
    type: 'success' | 'error' | 'warn' | 'info' = 'info',
    message: string,
    duration: number = 3000,
    showClose: boolean = true,
  ) {
    const config: MatSnackBarConfig = {
      duration: duration > 0 ? duration : undefined, // 0 or negative means no auto-close
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snack-${type}`], // We use this for custom colors
    };

    this.snackBar.open(message, showClose ? 'x' : '', config);
  }
}
