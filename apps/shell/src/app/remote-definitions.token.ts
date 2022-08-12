import { InjectionToken } from '@angular/core';

export const REMOTE_DEFINITIONS = new InjectionToken<Record<string, string>>(
  'REMOTE_DEFINITIONS'
);
