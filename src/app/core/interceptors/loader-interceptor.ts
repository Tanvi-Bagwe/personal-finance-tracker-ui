import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../../shared/service/loader-service/loader-service';

// Loader interceptor - shows loader on HTTP request and hides when response comes
export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Show loader when request starts
  loaderService.show();

  // Continue with the request and hide loader when completed
  return next(req).pipe(
    finalize(() => loaderService.hide()),
  );
};
