import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonButton, IonChip, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { callOutline, chatbubbleEllipsesOutline, heart, heartOutline, shareSocialOutline } from 'ionicons/icons';
import { combineLatest, switchMap } from 'rxjs';
import { AgentService, CompanyService } from '../../core/services/ecosystem.service';
import { PropertyService } from '../../core/services/property.service';
import { PropertyCardComponent } from '../../shared/components/property-card.component';

@Component({
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgFor, NgIf, RouterLink, IonButton, IonChip, IonIcon, PropertyCardComponent],
  template: `
    <div class="feature-page">
      <main class="page" *ngIf="vm$ | async as vm">
        <section class="detail-layout" *ngIf="vm.property as property">
          <div class="gallery">
            <img [src]="property.imageUrl" [alt]="property.title" />
            <img *ngFor="let image of property.gallery" [src]="image" [alt]="property.title" />
          </div>
          <article class="detail-panel">
            <p>{{ property.city }}، {{ property.district }}</p>
            <h1>{{ property.title }}</h1>
            <strong>{{ property.price | currency: 'MAD' : 'symbol' : '1.0-0' }}</strong>
            <div class="meta"><ion-chip>{{ property.bedrooms }} غرف</ion-chip><ion-chip>{{ property.bathrooms }} حمامات</ion-chip><ion-chip>{{ property.area }} م²</ion-chip></div>
            <p>{{ property.description }}</p>
            <div class="amenities"><ion-chip *ngFor="let amenity of property.amenities">{{ amenity }}</ion-chip></div>
            <div class="agent-box" *ngIf="vm.agent">
              <img [src]="vm.agent.avatarUrl" [alt]="vm.agent.name" />
              <div><h2>{{ vm.agent.name }}</h2><p>{{ vm.company?.name }} · {{ vm.agent.location }}</p></div>
            </div>
            <div class="action-row">
              <ion-button><ion-icon name="call-outline" /> اتصال</ion-button>
              <ion-button fill="outline" routerLink="/app/messages"><ion-icon name="chatbubble-ellipses-outline" /> رسالة</ion-button>
              <ion-button fill="clear" (click)="propertyService.toggleFavorite(property.id)"><ion-icon [name]="propertyService.isFavorite(property.id) ? 'heart' : 'heart-outline'" /> حفظ</ion-button>
              <ion-button fill="clear"><ion-icon name="share-social-outline" /> مشاركة</ion-button>
            </div>
          </article>
        </section>
        <section class="section-header"><h2>عقارات مشابهة</h2></section>
        <div class="property-grid"><app-property-card *ngFor="let item of vm.similar" [property]="item" /></div>
      </main>
    </div>
  `
})
export class PropertyDetailPageComponent {
  readonly propertyService = inject(PropertyService);
  private readonly route = inject(ActivatedRoute);
  private readonly agents = inject(AgentService);
  private readonly companies = inject(CompanyService);

  readonly vm$ = this.route.paramMap.pipe(
    switchMap((params) =>
      combineLatest({
        property: this.propertyService.getById(params.get('id') ?? ''),
        properties: this.propertyService.list(),
        agents: this.agents.list(),
        companies: this.companies.list()
      })
    ),
    switchMap((vm) =>
      combineLatest({
        property: [vm.property],
        agent: [vm.agents.find((agent) => agent.id === vm.property?.agentId)],
        company: [vm.companies.find((company) => company.id === vm.property?.companyId)],
        similar: [vm.properties.filter((item) => item.id !== vm.property?.id).slice(0, 3)]
      })
    )
  );

  constructor() {
    addIcons({ callOutline, chatbubbleEllipsesOutline, heart, heartOutline, shareSocialOutline });
  }
}
