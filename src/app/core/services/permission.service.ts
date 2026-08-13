import { Injectable, computed, inject } from '@angular/core';
import { Permission, UserRole } from '../models/domain.models';
import { AuthService } from './auth.service';

const rolePermissions: Record<UserRole, Permission[]> = {
  buyer: ['browse:properties', 'favorite:properties', 'message:agents'],
  agent: ['browse:properties', 'favorite:properties', 'message:agents', 'create:listings', 'manage:leads'],
  company: ['browse:properties', 'favorite:properties', 'message:agents', 'create:listings', 'manage:leads', 'manage:team', 'view:analytics']
};

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly auth = inject(AuthService);

  readonly permissions = computed(() => {
    const role = this.auth.currentUser().role;
    return rolePermissions[role];
  });

  can(permission: Permission): boolean {
    return this.permissions().includes(permission);
  }

  canRole(roles: UserRole[]): boolean {
    return roles.includes(this.auth.currentUser().role);
  }
}
