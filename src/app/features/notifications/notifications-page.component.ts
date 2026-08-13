import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { NotificationService } from '../../core/services/ecosystem.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, IonButton],
  template: `
    <div class="feature-page">
      <main class="page">
        <section class="section-header"><div><p>مركز التنبيهات</p><h1>الإشعارات</h1></div></section>
        <article class="notification" *ngFor="let item of notifications.list() | async" [class.unread]="!item.read">
          <div><h2>{{ item.title }}</h2><p>{{ item.body }}</p><small>{{ item.createdAt | date: 'medium' }}</small></div>
          <ion-button fill="clear" (click)="notifications.markRead(item.id)">تمت القراءة</ion-button>
        </article>
      </main>
    </div>
  `
})
export class NotificationsPageComponent {
  readonly notifications = inject(NotificationService);
}
