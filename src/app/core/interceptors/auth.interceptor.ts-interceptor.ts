import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorTsInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("access");

  if (token) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  return next(req);
};
