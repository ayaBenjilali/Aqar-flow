import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  it('allows agents to manage leads but not teams', (done) => {
    TestBed.configureTestingModule({});
    const auth = TestBed.inject(AuthService);
    const permissions = TestBed.inject(PermissionService);

    auth.demoLogin('agent').subscribe(() => {
      expect(permissions.can('manage:leads')).toBeTrue();
      expect(permissions.can('manage:team')).toBeFalse();
      done();
    });
  });
});
