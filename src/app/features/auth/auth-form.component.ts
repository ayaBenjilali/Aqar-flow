import { NgIf } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonButton, IonCard, IonInput, IonItem, IonLabel, IonSegment, IonSegmentButton, IonSpinner } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/domain.models';

@Component({
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink, IonButton, IonCard, IonInput, IonItem, IonLabel, IonSegment, IonSegmentButton, IonSpinner],
  template: `
    <ion-card class="auth-card">
      <h2>{{ title() }}</h2>
      <p *ngIf="mode() === 'login'">جرّب buyer&#64;demo.test أو agent&#64;demo.test أو company&#64;demo.test بكلمة مرور من 6 أحرف.</p>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-item *ngIf="mode() === 'register'">
          <ion-label position="stacked">الاسم الكامل</ion-label>
          <ion-input formControlName="name" autocomplete="name" />
        </ion-item>
        <ion-item>
          <ion-label position="stacked">البريد الإلكتروني</ion-label>
          <ion-input formControlName="email" type="email" autocomplete="email" />
        </ion-item>
        <ion-item *ngIf="mode() !== 'forgot'">
          <ion-label position="stacked">كلمة المرور</ion-label>
          <ion-input formControlName="password" [type]="showPassword() ? 'text' : 'password'" autocomplete="current-password" />
          <ion-button fill="clear" slot="end" type="button" (click)="togglePassword()">إظهار</ion-button>
        </ion-item>
        <ion-item *ngIf="mode() === 'register'">
          <ion-label>نوع الحساب</ion-label>
          <ion-segment formControlName="role">
            <ion-segment-button value="buyer">مشتري</ion-segment-button>
            <ion-segment-button value="agent">وسيط</ion-segment-button>
            <ion-segment-button value="company">شركة</ion-segment-button>
          </ion-segment>
        </ion-item>
        <p class="error" *ngIf="error()">{{ error() }}</p>
        <ion-button expand="block" type="submit" [disabled]="form.invalid || loading()">
          <ion-spinner *ngIf="loading()" name="crescent" />
          {{ actionLabel() }}
        </ion-button>
      </form>
      <div class="demo-actions" *ngIf="mode() === 'login'">
        <ion-button fill="outline" (click)="demo('buyer')">دخول كمشتري</ion-button>
        <ion-button fill="outline" (click)="demo('agent')">دخول كوسيط</ion-button>
        <ion-button fill="outline" (click)="demo('company')">دخول كشركة</ion-button>
      </div>
      <nav>
        <a routerLink="/auth/login">دخول</a>
        <a routerLink="/auth/register">حساب جديد</a>
        <a routerLink="/auth/forgot">نسيت كلمة المرور</a>
      </nav>
    </ion-card>
  `
})
export class AuthFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly mode = computed(() => this.route.snapshot.paramMap.get('mode') ?? 'login');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly showPassword = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: [''],
    email: ['buyer@demo.test', [Validators.required, Validators.email]],
    password: ['password', [Validators.minLength(6)]],
    role: ['buyer' as UserRole]
  });

  readonly title = computed(() => (this.mode() === 'register' ? 'إنشاء حساب' : this.mode() === 'forgot' ? 'استرجاع كلمة المرور' : 'تسجيل الدخول'));
  readonly actionLabel = computed(() => (this.mode() === 'register' ? 'إنشاء الحساب' : this.mode() === 'forgot' ? 'إرسال رابط الاسترجاع' : 'دخول'));

  submit(): void {
    this.error.set('');
    this.loading.set(true);
    const value = this.form.getRawValue();
    const request: Observable<unknown> =
      this.mode() === 'register'
        ? this.auth.register({ name: value.name, email: value.email, password: value.password, role: value.role })
        : this.mode() === 'forgot'
          ? this.auth.forgotPassword(value.email)
          : this.auth.login({ email: value.email, password: value.password });

    request.subscribe({
      next: () => this.router.navigateByUrl('/app/home'),
      error: (error: Error) => {
        this.error.set(error.message);
        this.loading.set(false);
      }
    });
  }

  demo(role: UserRole): void {
    this.loading.set(true);
    this.auth.demoLogin(role).subscribe(() => this.router.navigateByUrl('/app/home'));
  }

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }
}
