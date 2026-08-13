import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  it('redirects guests to login', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toEqual(TestBed.inject(Router).createUrlTree(['/auth/login']));
  });

  it('allows authenticated users', (done) => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const auth = TestBed.inject(AuthService);
    auth.demoLogin('buyer').subscribe(() => {
      const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
      expect(result).toBeTrue();
      done();
    });
  });
});
