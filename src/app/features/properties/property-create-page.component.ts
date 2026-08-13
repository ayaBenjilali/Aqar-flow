import { NgIf } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonInput, IonItem, IonLabel, IonProgressBar, IonSelect, IonSelectOption, IonTextarea, IonToggle } from '@ionic/angular/standalone';
import { PropertyService } from '../../core/services/property.service';

@Component({
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, IonButton, IonInput, IonItem, IonLabel, IonProgressBar, IonSelect, IonSelectOption, IonTextarea, IonToggle],
  template: `
    <div class="feature-page">
      <main class="page form-page">
        <section class="section-header"><div><p>إضافة إعلان</p><h1>{{ steps[step()] }}</h1></div><span>{{ step() + 1 }} / {{ steps.length }}</span></section>
        <ion-progress-bar [value]="(step() + 1) / steps.length" />
        <form [formGroup]="form" class="wizard">
          <section *ngIf="step() === 0">
            <ion-item><ion-label position="stacked">عنوان الإعلان</ion-label><ion-input formControlName="title" /></ion-item>
            <ion-item><ion-label>نوع العقار</ion-label><ion-select formControlName="type"><ion-select-option value="apartment">شقة</ion-select-option><ion-select-option value="villa">فيلا</ion-select-option><ion-select-option value="office">مكتب</ion-select-option><ion-select-option value="shop">محل</ion-select-option></ion-select></ion-item>
            <ion-item><ion-label>المعاملة</ion-label><ion-select formControlName="transaction"><ion-select-option value="sale">شراء</ion-select-option><ion-select-option value="rent">كراء</ion-select-option></ion-select></ion-item>
          </section>
          <section *ngIf="step() === 1">
            <ion-item><ion-label position="stacked">المدينة</ion-label><ion-input formControlName="city" /></ion-item>
            <ion-item><ion-label position="stacked">الحي</ion-label><ion-input formControlName="district" /></ion-item>
          </section>
          <section *ngIf="step() === 2">
            <ion-item><ion-label position="stacked">السعر</ion-label><ion-input type="number" formControlName="price" /></ion-item>
            <ion-item><ion-label>الحالة</ion-label><ion-select formControlName="status"><ion-select-option value="available">متاح</ion-select-option><ion-select-option value="reserved">محجوز</ion-select-option></ion-select></ion-item>
          </section>
          <section *ngIf="step() === 3">
            <ion-item><ion-label position="stacked">الغرف</ion-label><ion-input type="number" formControlName="bedrooms" /></ion-item>
            <ion-item><ion-label position="stacked">الحمامات</ion-label><ion-input type="number" formControlName="bathrooms" /></ion-item>
            <ion-item><ion-label position="stacked">المساحة</ion-label><ion-input type="number" formControlName="area" /></ion-item>
            <ion-item><ion-toggle formControlName="furnished">مفروش</ion-toggle></ion-item>
            <ion-item><ion-toggle formControlName="parking">موقف سيارات</ion-toggle></ion-item>
          </section>
          <section *ngIf="step() === 4">
            <ion-item><ion-label position="stacked">رابط صورة رئيسية</ion-label><ion-input formControlName="imageUrl" /></ion-item>
            <ion-item><ion-label position="stacked">المرافق</ion-label><ion-input formControlName="amenities" placeholder="مصعد، حراسة، شرفة" /></ion-item>
          </section>
          <section *ngIf="step() === 5" class="preview-box">
            <h2>{{ form.value.title }}</h2>
            <p>{{ form.value.city }}، {{ form.value.district }}</p>
            <p>{{ form.value.description }}</p>
          </section>
          <ion-item><ion-label position="stacked">الوصف</ion-label><ion-textarea formControlName="description" rows="3" /></ion-item>
        </form>
        <div class="action-row">
          <ion-button fill="outline" (click)="previous()" [disabled]="step() === 0">السابق</ion-button>
          <ion-button fill="clear" (click)="saveDraft()">حفظ مسودة</ion-button>
          <ion-button (click)="next()" [disabled]="form.invalid">{{ step() === steps.length - 1 ? 'نشر الإعلان' : 'التالي' }}</ion-button>
        </div>
        <p class="success" *ngIf="saved()">تم حفظ المسودة محليا لهذا العرض التجريبي.</p>
      </main>
    </div>
  `
})
export class PropertyCreatePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly properties = inject(PropertyService);
  readonly steps = ['المعلومات الأساسية', 'الموقع', 'التسعير', 'الميزات', 'الصور', 'المعاينة'];
  readonly step = signal(0);
  readonly saved = signal(false);
  readonly isLast = computed(() => this.step() === this.steps.length - 1);
  readonly form = this.fb.nonNullable.group({
    title: ['شقة جديدة في المعاريف', Validators.required],
    titleEn: ['New apartment in Maarif'],
    type: ['apartment' as const, Validators.required],
    transaction: ['sale' as const, Validators.required],
    city: ['الدار البيضاء', Validators.required],
    district: ['المعاريف', Validators.required],
    price: [1450000, [Validators.required, Validators.min(1)]],
    status: ['available' as const],
    bedrooms: [2],
    bathrooms: [2],
    area: [94, [Validators.required, Validators.min(20)]],
    furnished: [false],
    parking: [true],
    imageUrl: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80', Validators.required],
    amenities: ['مصعد، حراسة، شرفة'],
    description: ['إعلان تجريبي مكتمل يوضح نموذج إنشاء متعدد الخطوات.']
  });

  previous(): void {
    this.step.update((value) => Math.max(0, value - 1));
  }

  next(): void {
    if (!this.isLast()) {
      this.step.update((value) => value + 1);
      return;
    }
    const value = this.form.getRawValue();
    this.properties
      .create({
        ...value,
        featured: false,
        gallery: [value.imageUrl],
        amenities: value.amenities.split('،').map((item) => item.trim()),
        agentId: 'a-1',
        companyId: 'c-1'
      })
      .subscribe((property) => this.router.navigate(['/app/properties', property.id]));
  }

  saveDraft(): void {
    localStorage.setItem('aqarflow.listingDraft', JSON.stringify(this.form.getRawValue()));
    this.saved.set(true);
  }
}
