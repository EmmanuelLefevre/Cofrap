import { HttpInterceptorFn } from '@angular/common/http';

import { ENVIRONMENT } from '@env/environment';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const IS_K8S_URL = req.url.startsWith(ENVIRONMENT.k8sUrl);

  if (IS_K8S_URL) {
    req = req.clone({
      withCredentials: true
    });
  }

  return next(req);
};
