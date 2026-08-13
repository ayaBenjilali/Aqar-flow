import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('logs in a demo buyer and persists a token', (done) => {
    service.demoLogin('buyer').subscribe((session) => {
      expect(session.user.role).toBe('buyer');
      expect(localStorage.getItem('aqarflow.token')).toContain('demo-token-buyer');
      expect(service.isAuthenticated()).toBeTrue();
      done();
    });
  });

  it('rejects invalid login credentials', (done) => {
    service.login({ email: 'missing@example.com', password: 'password' }).subscribe({
      error: (error: Error) => {
        expect(error.message).toContain('بيانات الدخول');
        done();
      }
    });
  });
});
