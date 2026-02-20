import { CanActivateFn, Router } from '@angular/router';
import { ExamSession } from '../services/exam-session';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const examReadyGuard: CanActivateFn = (route, state) => {

  const examSession = inject(ExamSession);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // 🚨 If SSR → block navigation safely
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  if (examSession.isReady()) {
    return true;
  }

  return router.createUrlTree([
    '/student/exam-instructions',
    route.paramMap.get('id')
  ]);
};
