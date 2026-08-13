import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonBadge, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline,
  chatbubbleEllipsesOutline,
  gridOutline,
  heartOutline,
  homeOutline,
  languageOutline,
  notificationsOutline,
  personCircleOutline,
  searchOutline
} from 'ionicons/icons';
import { Permission, UserRole } from '../../core/models/domain.models';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/ecosystem.service';
import { I18nService } from '../../core/services/i18n.service';
import { PermissionService } from '../../core/services/permission.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  permission?: Permission;
}

@Component({
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, RouterOutlet, IonBadge, IonButton, IonIcon],
  template: `
    <div class="web-app-shell">
      <header class="web-header">
        <a class="brand" routerLink="/app/home"><span>Aqar</span>Flow</a>

        <nav class="top-nav" aria-label="التنقل الرئيسي">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.path"
            routerLinkActive="active"
            [hidden]="item.permission && !permissions.can(item.permission)"
          >
            <ion-icon [name]="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <div class="header-tools">
          <div class="role-switcher" aria-label="تغيير الدور">
            <button
              *ngFor="let role of roles"
              type="button"
              [class.active]="auth.currentUser().role === role.value"
              (click)="switchRole(role.value)"
            >
              {{ role.label }}
            </button>
          </div>

          <ion-button fill="clear" class="icon-action" (click)="i18n.toggleLanguage()">
            <ion-icon name="language-outline" />
            {{ i18n.language() === 'ar' ? 'EN' : 'AR' }}
          </ion-button>

          <ion-button fill="clear" class="icon-action" routerLink="/app/notifications" aria-label="الإشعارات">
            <ion-icon name="notifications-outline" />
            <ion-badge *ngIf="notifications.unreadCount()">{{ notifications.unreadCount() }}</ion-badge>
          </ion-button>
        </div>
      </header>

      <main class="route-scroll">
        <router-outlet />
      </main>

      <nav class="mobile-nav" aria-label="التنقل الرئيسي">
        <a *ngFor="let item of mobileItems" [routerLink]="item.path" routerLinkActive="active">
          <ion-icon [name]="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </div>
  `
})
export class AppShellComponent {
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);
  readonly notifications = inject(NotificationService);
  readonly permissions = inject(PermissionService);

  readonly roles: Array<{ label: string; value: UserRole }> = [
    { label: 'مشتري', value: 'buyer' },
    { label: 'وسيط', value: 'agent' },
    { label: 'شركة', value: 'company' }
  ];

  readonly navItems: NavItem[] = [
    { label: 'الرئيسية', path: '/app/home', icon: 'home-outline' },
    { label: 'البحث', path: '/app/search', icon: 'search-outline' },
    { label: 'المفضلة', path: '/app/dashboard', icon: 'heart-outline' },
    { label: 'CRM', path: '/app/crm', icon: 'briefcase-outline', permission: 'manage:leads' },
    { label: 'الأداء', path: '/app/dashboard', icon: 'grid-outline' },
    { label: 'الرسائل', path: '/app/messages', icon: 'chatbubble-ellipses-outline' },
    { label: 'الحساب', path: '/app/profile', icon: 'person-circle-outline' }
  ];

  readonly mobileItems = this.navItems.filter((item) => !item.permission).slice(0, 5);

  constructor() {
    addIcons({
      homeOutline,
      searchOutline,
      chatbubbleEllipsesOutline,
      personCircleOutline,
      notificationsOutline,
      languageOutline,
      heartOutline,
      briefcaseOutline,
      gridOutline
    });
  }

  switchRole(role: UserRole): void {
    this.auth.setDemoRole(role);
  }
}
