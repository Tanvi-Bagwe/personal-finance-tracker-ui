import { Injectable, signal } from '@angular/core';

// Loader service - manages loading state for HTTP requests
@Injectable({ providedIn: 'root' })
export class LoaderService {
  readonly isLoading = signal<boolean>(false);

  // Show loading spinner
  show() {
    this.isLoading.set(true);
  }

  // Hide loading spinner
  hide() {
    this.isLoading.set(false);
  }
}
