import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/domain.models';
import { PermissionService } from '../services/permission.service';

export const roleGuard: CanActivateFn = (route) => {
  const roles = (route.data['roles'] ?? []) as UserRole[];
  const permissions = inject(PermissionService);
  const router = inject(Router);

  return permissions.canRole(roles) ? true : router.createUrlTree(['/app/home']);
};
