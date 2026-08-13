import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthSession, User, UserRole } from '../models/domain.models';
import { users } from './mock-data';
import { MockApiService } from './mock-api.service';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  role: UserRole;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(MockApiService);
  private readonly fallbackUser = users[0];
  private readonly session = signal<AuthSession | null>(this.restoreSession());
  private readonly selectedDemoRole = signal<UserRole>(this.session()?.user.role ?? 'buyer');

  readonly currentUser = computed(() => {
    const sessionUser = this.session()?.user;
    if (sessionUser && sessionUser.role === this.selectedDemoRole()) {
      return sessionUser;
    }

    return users.find((user) => user.role === this.selectedDemoRole()) ?? this.fallbackUser;
  });

  readonly isAuthenticated = computed(() => Boolean(this.session()));

  setDemoRole(role: UserRole): void {
    const user = users.find((candidate) => candidate.role === role) ?? this.fallbackUser;
    this.selectedDemoRole.set(role);
    this.persist(this.createSession(user));
  }

  login(payload: LoginPayload): Observable<AuthSession> {
    const user = users.find((candidate) => candidate.email.toLowerCase() === payload.email.toLowerCase());
    if (!user || payload.password.length < 6) {
      return this.api.fail('بيانات الدخول غير صحيحة');
    }

    return this.api.post('/api/auth/login', this.createSession(user)).pipe(
      tap((session) => {
        this.selectedDemoRole.set(session.user.role);
        this.persist(session);
      })
    );
  }

  demoLogin(role: UserRole): Observable<AuthSession> {
    const user = users.find((candidate) => candidate.role === role) ?? this.fallbackUser;
    return this.api.post('/api/auth/login', this.createSession(user)).pipe(
      tap((session) => {
        this.selectedDemoRole.set(role);
        this.persist(session);
      })
    );
  }

  register(payload: RegisterPayload): Observable<AuthSession> {
    const user: User = {
      id: `u-${crypto.randomUUID()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
      phone: payload.phone,
      location: 'المغرب'
    };

    return this.api.post('/api/auth/register', this.createSession(user)).pipe(
      tap((session) => {
        this.selectedDemoRole.set(session.user.role);
        this.persist(session);
      })
    );
  }

  forgotPassword(email: string): Observable<{ ok: true; email: string }> {
    return this.api.post('/api/auth/forgot-password', { ok: true, email });
  }

  resetPassword(token: string, password: string): Observable<{ ok: true }> {
    return this.api.post('/api/auth/reset-password', { ok: Boolean(token && password.length >= 8) as true });
  }

  logout(): void {
    localStorage.removeItem('aqarflow.token');
    localStorage.removeItem('aqarflow.user');
    this.selectedDemoRole.set('buyer');
    this.session.set(null);
  }

  private createSession(user: User): AuthSession {
    return {
      token: `demo-token-${user.role}-${Date.now()}`,
      user
    };
  }

  private persist(session: AuthSession): void {
    localStorage.setItem('aqarflow.token', session.token);
    localStorage.setItem('aqarflow.user', JSON.stringify(session.user));
    this.session.set(session);
  }

  private restoreSession(): AuthSession | null {
    const token = localStorage.getItem('aqarflow.token');
    const userJson = localStorage.getItem('aqarflow.user');
    if (!token || !userJson) {
      return null;
    }

    return { token, user: JSON.parse(userJson) as User };
  }
}
