import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { combineLatest } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { LeadService, MessageService } from '../../core/services/ecosystem.service';
import { PropertyService } from '../../core/services/property.service';
import { PropertyCardComponent } from '../../shared/components/property-card.component';

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterLink, IonButton, PropertyCardComponent],
  template: `
    <div class="feature-page">
      <main class="page" *ngIf="vm$ | async as vm">
        <section class="section-header">
          <div><p>{{ userLabel }}</p><h1>لوحة التحكم</h1></div>
          <ion-button *ngIf="auth.currentUser()?.role !== 'buyer'" routerLink="/app/crm">فتح CRM</ion-button>
        </section>
        <section class="stats-grid">
          <article><strong>{{ vm.favorites.length }}</strong><span>عقارات محفوظة</span></article>
          <article><strong>{{ vm.conversations.length }}</strong><span>محادثات</span></article>
          <article><strong>{{ vm.leads.length }}</strong><span>عملاء محتملون</span></article>
          <article><strong>38%</strong><span>معدل التحويل</span></article>
        </section>
        <section class="chart-panel">
          <h2>النشاط الشهري</h2>
          <div class="bar-chart" aria-label="رسم بياني مبسط للنشاط">
            <span style="--value: 55%"></span><span style="--value: 80%"></span><span style="--value: 45%"></span><span style="--value: 92%"></span><span style="--value: 68%"></span>
          </div>
        </section>
        <section class="section-header compact"><h2>المحفوظات الأخيرة</h2></section>
        <div class="property-grid">
          <app-property-card *ngFor="let property of vm.favorites" [property]="property" layout="compact" />
        </div>
      </main>
    </div>
  `
})
export class DashboardPageComponent {
  readonly auth = inject(AuthService);
  private readonly properties = inject(PropertyService);
  private readonly leads = inject(LeadService);
  private readonly messages = inject(MessageService);
  readonly vm$ = combineLatest({
    favorites: [this.properties.favorites()],
    leads: this.leads.list(),
    conversations: this.messages.listConversations()
  });

  get userLabel(): string {
    const role = this.auth.currentUser()?.role;
    return role === 'company' ? 'إدارة الشركة' : role === 'agent' ? 'أداء الوسيط' : 'رحلة المشتري';
  }
}
