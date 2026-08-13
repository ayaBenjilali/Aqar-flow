import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'app/home' },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth-page.component').then((m) => m.AuthPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: ':mode', loadComponent: () => import('./features/auth/auth-form.component').then((m) => m.AuthFormComponent) }
    ]
  },
  {
    path: 'app',
    loadComponent: () => import('./features/shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent) },
      { path: 'search', loadComponent: () => import('./features/search/search-page.component').then((m) => m.SearchPageComponent) },
      { path: 'properties/new', canActivate: [roleGuard], data: { roles: ['agent', 'company'] }, loadComponent: () => import('./features/properties/property-create-page.component').then((m) => m.PropertyCreatePageComponent) },
      { path: 'properties/:id', loadComponent: () => import('./features/properties/property-detail-page.component').then((m) => m.PropertyDetailPageComponent) },
      { path: 'crm', canActivate: [roleGuard], data: { roles: ['agent', 'company'] }, loadComponent: () => import('./features/crm/crm-page.component').then((m) => m.CrmPageComponent) },
      { path: 'messages', loadComponent: () => import('./features/messages/messages-page.component').then((m) => m.MessagesPageComponent) },
      { path: 'notifications', loadComponent: () => import('./features/notifications/notifications-page.component').then((m) => m.NotificationsPageComponent) },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent) },
      { path: 'profile', loadComponent: () => import('./features/profile/profile-page.component').then((m) => m.ProfilePageComponent) }
    ]
  },
  { path: '**', redirectTo: 'app/home' }
];
