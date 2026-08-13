import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IonBadge, IonSpinner } from '@ionic/angular/standalone';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { PropertyFilters } from '../../core/models/domain.models';
import { PropertyService } from '../../core/services/property.service';
import { PropertyCardComponent } from '../../shared/components/property-card.component';
import { PropertyFilterComponent } from '../../shared/components/property-filter.component';

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, IonBadge, IonSpinner, PropertyCardComponent, PropertyFilterComponent],
  template: `
    <div class="feature-page">
      <main class="page">
        <section class="section-header">
          <div><p>بحث متقدم</p><h1>فلترة العقارات</h1></div>
          <ion-badge>{{ propertyService.activeFilterCount() }} مرشح</ion-badge>
        </section>
        <app-property-filter [filters]="propertyService.filters()" (filtersChange)="update($event)" />
        <div class="loading" *ngIf="loading()"> <ion-spinner /> جار تحميل النتائج...</div>
        <ng-container *ngIf="results$ | async as results">
          <p class="muted">{{ results.length }} نتيجة مطابقة</p>
          <div class="property-grid" *ngIf="results.length; else empty">
            <app-property-card *ngFor="let property of results" [property]="property" [isFavorite]="propertyService.isFavorite(property.id)" (favorite)="propertyService.toggleFavorite($event)" />
          </div>
        </ng-container>
        <ng-template #empty><section class="empty-state"><h2>لا توجد نتائج</h2><p>جرّب إزالة بعض المرشحات أو توسيع الميزانية.</p></section></ng-template>
      </main>
    </div>
  `
})
export class SearchPageComponent {
  readonly propertyService = inject(PropertyService);
  readonly loading = signal(false);
  private readonly refresh = new BehaviorSubject(this.propertyService.filters());
  readonly results$ = this.refresh.pipe(
    tap(() => this.loading.set(true)),
    switchMap((filters) => this.propertyService.search(filters)),
    tap(() => this.loading.set(false))
  );

  update(filters: PropertyFilters): void {
    this.propertyService.filters.set(filters);
    this.refresh.next(filters);
  }
}
