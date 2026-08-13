import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCheckbox, IonInput, IonItem, IonLabel, IonSearchbar, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { PropertyFilters } from '../../core/models/domain.models';
import { defaultFilters } from '../../core/services/property.service';

@Component({
  selector: 'app-property-filter',
  standalone: true,
  imports: [FormsModule, IonButton, IonCheckbox, IonInput, IonItem, IonLabel, IonSearchbar, IonSelect, IonSelectOption],
  template: `
    <section class="filters" aria-label="مرشحات البحث">
      <ion-searchbar [(ngModel)]="draft.query" placeholder="ابحث عن مدينة أو حي أو عقار" (ionInput)="emit()" />
      <div class="filter-grid">
        <ion-item>
          <ion-label>المدينة</ion-label>
          <ion-select [(ngModel)]="draft.city" (ionChange)="emit()" interface="popover">
            <ion-select-option value="">الكل</ion-select-option>
            <ion-select-option value="الرباط">الرباط</ion-select-option>
            <ion-select-option value="الدار البيضاء">الدار البيضاء</ion-select-option>
            <ion-select-option value="طنجة">طنجة</ion-select-option>
            <ion-select-option value="مراكش">مراكش</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>المعاملة</ion-label>
          <ion-select [(ngModel)]="draft.transaction" (ionChange)="emit()" interface="popover">
            <ion-select-option value="">الكل</ion-select-option>
            <ion-select-option value="sale">شراء</ion-select-option>
            <ion-select-option value="rent">كراء</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>النوع</ion-label>
          <ion-select [(ngModel)]="draft.type" (ionChange)="emit()" interface="popover">
            <ion-select-option value="">الكل</ion-select-option>
            <ion-select-option value="apartment">شقق</ion-select-option>
            <ion-select-option value="villa">فلل</ion-select-option>
            <ion-select-option value="office">مكاتب</ion-select-option>
            <ion-select-option value="shop">محلات</ion-select-option>
            <ion-select-option value="land">أراضي</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">أقل سعر</ion-label>
          <ion-input type="number" [(ngModel)]="draft.minPrice" (ionInput)="emit()" />
        </ion-item>
        <ion-item>
          <ion-label position="stacked">أعلى سعر</ion-label>
          <ion-input type="number" [(ngModel)]="draft.maxPrice" (ionInput)="emit()" />
        </ion-item>
        <ion-item>
          <ion-label position="stacked">غرف على الأقل</ion-label>
          <ion-input type="number" [(ngModel)]="draft.bedrooms" (ionInput)="emit()" />
        </ion-item>
        <ion-item>
          <ion-checkbox [(ngModel)]="draft.furnished" (ionChange)="emit()">مفروش</ion-checkbox>
        </ion-item>
        <ion-item>
          <ion-checkbox [(ngModel)]="draft.parking" (ionChange)="emit()">موقف سيارات</ion-checkbox>
        </ion-item>
        <ion-item>
          <ion-label>الترتيب</ion-label>
          <ion-select [(ngModel)]="draft.sort" (ionChange)="emit()" interface="popover">
            <ion-select-option value="latest">الأحدث</ion-select-option>
            <ion-select-option value="priceAsc">السعر الأقل</ion-select-option>
            <ion-select-option value="priceDesc">السعر الأعلى</ion-select-option>
            <ion-select-option value="areaDesc">المساحة الأكبر</ion-select-option>
          </ion-select>
        </ion-item>
      </div>
      <ion-button fill="clear" (click)="reset()">إعادة ضبط المرشحات</ion-button>
    </section>
  `,
  styles: [
    `
      .filters {
        display: grid;
        gap: 12px;
      }
      .filter-grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }
      ion-item {
        --border-radius: 8px;
        --background: #fff;
        border: 1px solid var(--af-border);
        border-radius: 8px;
      }
    `
  ]
})
export class PropertyFilterComponent {
  @Input() set filters(value: PropertyFilters) {
    this.draft = { ...value };
  }
  @Output() filtersChange = new EventEmitter<PropertyFilters>();

  draft: PropertyFilters = { ...defaultFilters };

  emit(): void {
    this.filtersChange.emit({ ...this.draft });
  }

  reset(): void {
    this.draft = { ...defaultFilters };
    this.emit();
  }
}
