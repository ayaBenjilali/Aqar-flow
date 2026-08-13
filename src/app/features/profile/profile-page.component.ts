import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonButton, IonChip } from '@ionic/angular/standalone';
import { combineLatest, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AgentService, CompanyService } from '../../core/services/ecosystem.service';
import { PropertyService } from '../../core/services/property.service';
import { PropertyCardComponent } from '../../shared/components/property-card.component';

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, IonButton, IonChip, PropertyCardComponent],
  template: `
    <div class="feature-page">
      <main class="page" *ngIf="vm$ | async as vm">
        <section class="profile-hero">
          <img [src]="auth.currentUser().avatarUrl" [alt]="auth.currentUser().name" />
          <div>
            <p>{{ roleLabel }}</p>
            <h1>{{ auth.currentUser().name }}</h1>
            <span>{{ auth.currentUser().location }}</span>
            <div>
              <ion-chip *ngFor="let specialty of vm.agent?.specialties ?? ['بحث', 'مفضلة', 'رسائل']">
                {{ specialty }}
              </ion-chip>
            </div>
          </div>
          <ion-button>تعديل الحساب</ion-button>
        </section>

        <section class="split-grid">
          <article class="panel">
            <h2>نبذة مهنية</h2>
            <p>{{ vm.agent?.bio ?? vm.company?.description ?? 'حساب تجريبي يوضح تجربة المستخدم العربي داخل AqarFlow.' }}</p>
          </article>
          <article class="panel" *ngIf="vm.company">
            <h2>{{ vm.company.name }}</h2>
            <p>{{ vm.company.location }} · {{ vm.company.agents }} وكلاء · {{ vm.company.listings }} إعلان</p>
          </article>
        </section>

        <section class="section-header compact">
          <h2>عقارات مرتبطة</h2>
        </section>
        <div class="property-grid">
          <app-property-card *ngFor="let property of vm.properties" [property]="property" />
        </div>
      </main>
    </div>
  `
})
export class ProfilePageComponent {
  readonly auth = inject(AuthService);
  private readonly agents = inject(AgentService);
  private readonly companies = inject(CompanyService);
  private readonly properties = inject(PropertyService);

  readonly vm$ = combineLatest({
    agents: this.agents.list(),
    companies: this.companies.list(),
    properties: this.properties.list()
  }).pipe(
    map((vm) => {
      const user = this.auth.currentUser();
      const agent = vm.agents.find((candidate) => candidate.name === user.name);
      const company = vm.companies.find((candidate) => candidate.id === user.companyId);
      return {
        agent,
        company,
        properties: vm.properties.filter((property) => !agent || property.agentId === agent.id)
      };
    })
  );

  get roleLabel(): string {
    const role = this.auth.currentUser().role;
    return role === 'company' ? 'مدير شركة' : role === 'agent' ? 'وسيط عقاري' : 'مشتري';
  }
}
