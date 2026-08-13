import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonBadge, IonButton, IonCard, IonChip, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bedOutline, carOutline, heart, heartOutline, locationOutline, resizeOutline } from 'ionicons/icons';
import { Property } from '../../core/models/domain.models';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CurrencyPipe, NgClass, RouterLink, IonBadge, IonButton, IonCard, IonChip, IonIcon],
  template: `
    <ion-card class="property-card" [ngClass]="layout">
      <a [routerLink]="['/app/properties', property.id]" class="image-link" [attr.aria-label]="property.title">
        <img [src]="property.imageUrl" [alt]="property.title" />
        <ion-badge>{{ property.transaction === 'sale' ? 'شراء' : 'كراء' }}</ion-badge>
      </a>
      <div class="property-body">
        <div class="title-row">
          <div>
            <h3>{{ property.title }}</h3>
            <p><ion-icon name="location-outline" /> {{ property.city }}، {{ property.district }}</p>
          </div>
          <ion-button fill="clear" shape="round" (click)="favorite.emit(property.id)" [attr.aria-label]="'حفظ ' + property.title">
            <ion-icon [name]="isFavorite ? 'heart' : 'heart-outline'" />
          </ion-button>
        </div>
        <strong>{{ property.price | currency: 'MAD' : 'symbol' : '1.0-0' }}</strong>
        <div class="meta">
          <ion-chip><ion-icon name="bed-outline" /> {{ property.bedrooms }}</ion-chip>
          <ion-chip><ion-icon name="resize-outline" /> {{ property.area }} م²</ion-chip>
          <ion-chip><ion-icon name="car-outline" /> {{ property.parking ? 'موقف' : 'بدون' }}</ion-chip>
        </div>
      </div>
    </ion-card>
  `,
  styles: [
    `
      .property-card {
        margin: 0;
        overflow: hidden;
        border-radius: 8px;
        border: 1px solid var(--af-border);
        box-shadow: var(--af-shadow);
        background: var(--ion-color-light);
      }
      .property-card.compact {
        display: grid;
        grid-template-columns: minmax(120px, 34%) 1fr;
      }
      .image-link {
        position: relative;
        display: block;
        min-height: 180px;
      }
      .compact .image-link {
        min-height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        min-height: 180px;
        object-fit: cover;
        display: block;
      }
      ion-badge {
        position: absolute;
        inset-inline-start: 12px;
        top: 12px;
      }
      .property-body {
        padding: 14px;
        display: grid;
        gap: 10px;
      }
      .title-row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
      h3 {
        margin: 0 0 4px;
        font-size: 1rem;
      }
      p {
        margin: 0;
        color: var(--af-muted);
        display: flex;
        align-items: center;
        gap: 4px;
      }
      strong {
        color: var(--ion-color-primary);
        font-size: 1.05rem;
      }
      .meta {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      ion-chip {
        margin: 0;
      }
    `
  ]
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;
  @Input() isFavorite = false;
  @Input() layout: 'standard' | 'compact' = 'standard';
  @Output() favorite = new EventEmitter<string>();

  constructor() {
    addIcons({ heart, heartOutline, locationOutline, bedOutline, resizeOutline, carOutline });
  }
}
