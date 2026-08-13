import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  businessOutline,
  diamondOutline,
  homeOutline,
  keyOutline,
  mapOutline,
  peopleOutline,
  storefrontOutline,
  trendingUpOutline,
  trophyOutline
} from 'ionicons/icons';
import { combineLatest } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AgentService, FeedService } from '../../core/services/ecosystem.service';
import { PermissionService } from '../../core/services/permission.service';
import { PropertyService } from '../../core/services/property.service';
import { PropertyCardComponent } from '../../shared/components/property-card.component';

interface CategoryCard {
  label: string;
  hint: string;
  count: string;
  icon: string;
  image: string;
}

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterLink, IonButton, IonIcon, IonSearchbar, PropertyCardComponent],
  template: `
    <div class="feature-page">
      <main class="page home-page">
        <section class="luxury-hero">
          <div class="hero-copy reveal-up">
            <p class="eyebrow"><ion-icon name="diamond-outline" /> منصة عقارية عربية</p>
            <h1>{{ hero().title }}</h1>
            <p class="hero-text">{{ hero().subtitle }}</p>

            <div class="hero-search glass-search">
              <ion-searchbar placeholder="ابحث عن فيلا، شقة، مكتب، محل أو أرض..." routerLink="/app/search" />
              <ion-button routerLink="/app/search">استكشاف العقارات</ion-button>
            </div>

            <div class="hero-actions">
              <a routerLink="/app/search">بحث متقدم</a>
              <a routerLink="/app/dashboard">لوحة العرض</a>
              <a *ngIf="permissions.can('create:listings')" routerLink="/app/properties/new">إضافة إعلان</a>
              <a *ngIf="permissions.can('manage:leads')" routerLink="/app/crm">CRM العملاء</a>
            </div>
          </div>

          <aside class="hero-showcase reveal-up delay-1">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" alt="فيلا عصرية فاخرة" />
            <div class="showcase-card">
              <span>عرض مميز</span>
              <strong>6.2M MAD</strong>
              <p>عين الذئاب، الدار البيضاء</p>
            </div>
          </aside>
        </section>

        <section class="metric-strip reveal-up delay-2" aria-label="مؤشرات المنصة">
          <article><ion-icon name="business-outline" /><strong>124</strong><span>إعلان نشط</span></article>
          <article><ion-icon name="people-outline" /><strong>27</strong><span>وسيط موثوق</span></article>
          <article><ion-icon name="trending-up-outline" /><strong>389</strong><span>فرصة CRM</span></article>
          <article><ion-icon name="trophy-outline" /><strong>18%</strong><span>نمو الطلب</span></article>
        </section>

        <section class="role-experience reveal-up">
          <article>
            <span>{{ hero().badge }}</span>
            <h2>{{ hero().panelTitle }}</h2>
            <p>{{ hero().panelText }}</p>
          </article>
          <div class="role-steps">
            <div *ngFor="let step of hero().steps">
              <strong>{{ step.title }}</strong>
              <span>{{ step.text }}</span>
            </div>
          </div>
        </section>

        <section class="section-header reveal-up">
          <div>
            <p>اختيارات واضحة وسريعة</p>
            <h2>استكشف حسب نوع العقار</h2>
          </div>
          <a routerLink="/app/search">كل التصنيفات</a>
        </section>

        <section class="category-grid reveal-up">
          <a class="category-card" *ngFor="let category of categories" routerLink="/app/search">
            <img [src]="category.image" [alt]="category.label" />
            <span><ion-icon [name]="category.icon" /> {{ category.count }}</span>
            <h3>{{ category.label }}</h3>
            <p>{{ category.hint }}</p>
          </a>
        </section>

        <ng-container *ngIf="vm$ | async as vm">
          <section class="section-header reveal-up">
            <div>
              <p>مختارة بعناية</p>
              <h2>عقارات بارزة</h2>
            </div>
            <a routerLink="/app/search">عرض الكل</a>
          </section>

          <div class="property-grid featured-grid reveal-up">
            <app-property-card
              *ngFor="let property of vm.properties"
              [property]="property"
              [isFavorite]="propertyService.isFavorite(property.id)"
              (favorite)="propertyService.toggleFavorite($event)"
            />
          </div>

          <section class="luxury-band reveal-up">
            <article>
              <p>تجربة متكاملة</p>
              <h2>بحث راق، تواصل سريع، ولوحات تشغيل جاهزة للوسطاء والشركات.</h2>
            </article>
            <div class="band-actions">
              <ion-button routerLink="/app/search">فتح البحث</ion-button>
              <ion-button fill="outline" routerLink="/app/messages">الرسائل</ion-button>
            </div>
          </section>

          <section class="split-grid content-band reveal-up">
            <article class="panel feed-panel">
              <div class="section-header compact">
                <div>
                  <p>رؤى السوق</p>
                  <h2>تحديثات المهنيين</h2>
                </div>
              </div>
              <div class="post-card" *ngFor="let post of vm.posts">
                <p>{{ post.text }}</p>
                <div class="post-actions">
                  <ion-button size="small" fill="clear" (click)="feed.like(post.id)">إعجاب {{ post.likes }}</ion-button>
                  <ion-button size="small" fill="clear" (click)="feed.follow(post.id)">
                    {{ post.following ? 'متابع' : 'متابعة' }}
                  </ion-button>
                </div>
              </div>
            </article>

            <article class="panel agents-panel">
              <div class="section-header compact">
                <div>
                  <p>شبكة موثوقة</p>
                  <h2>وكلاء مميزون</h2>
                </div>
              </div>
              <div class="agent-row" *ngFor="let agent of vm.agents">
                <img [src]="agent.avatarUrl" [alt]="agent.name" />
                <div>
                  <strong>{{ agent.name }}</strong>
                  <span>{{ agent.location }} · {{ agent.followers }} متابع</span>
                </div>
                <ion-button fill="outline" size="small">متابعة</ion-button>
              </div>
            </article>
          </section>
        </ng-container>
      </main>
    </div>
  `
})
export class HomePageComponent {
  readonly auth = inject(AuthService);
  readonly propertyService = inject(PropertyService);
  readonly permissions = inject(PermissionService);
  readonly feed = inject(FeedService);
  private readonly agents = inject(AgentService);

  readonly hero = computed(() => {
    const role = this.auth.currentUser().role;
    if (role === 'agent') {
      return {
        title: 'واجهة فاخرة للوسيط: عقارات، عملاء، ورسائل في مسار واحد.',
        subtitle: 'بدل إلى تجربة الوسيط لإظهار إنشاء الإعلانات، إدارة العملاء، والمتابعة اليومية داخل CRM.',
        badge: 'تجربة الوسيط',
        panelTitle: 'إدارة مبيعات عقارية بدون فوضى',
        panelText: 'يعرض AqarFlow كيف يمكن لوسيط عقاري متابعة العملاء، نشر العقارات، والرد على الرسائل من واجهة واحدة.',
        steps: [
          { title: 'إعلانات', text: 'إنشاء إعلان متعدد الخطوات' },
          { title: 'Leads', text: 'لوحة Kanban لحالة العميل' },
          { title: 'متابعة', text: 'رسائل وتنبيهات ومواعيد' }
        ]
      };
    }

    if (role === 'company') {
      return {
        title: 'منصة تشغيل عقاري للشركات: فرق، أداء، ومحفظة عقارات.',
        subtitle: 'تجربة الشركة تبرز التحليلات، إدارة الفريق، العقارات، والعملاء المحتملين على مستوى المؤسسة.',
        badge: 'تجربة الشركة',
        panelTitle: 'نظرة إدارية على المحفظة والفريق',
        panelText: 'تم تصميم الواجهة لتوضيح كيف يمكن لشركة وساطة إدارة وكلائها، إعلاناتها، وأداء العملاء المحتملين.',
        steps: [
          { title: 'فريق', text: 'متابعة نشاط الوسطاء' },
          { title: 'محفظة', text: 'عقارات الشركة في مكان واحد' },
          { title: 'أداء', text: 'مؤشرات وتحويلات شهرية' }
        ]
      };
    }

    return {
      title: 'اكتشف عقارات راقية، مكاتب فاخرة، وفرص استثمارية في منصة واحدة.',
      subtitle: 'تجربة عربية فاخرة للبحث العقاري: فلل، شقق، مكاتب، محلات، أراضي، رسائل، وحفظ العقارات المفضلة.',
      badge: 'تجربة المشتري',
      panelTitle: 'بحث سريع، واضح، ومريح',
      panelText: 'ابدأ من التصنيفات أو البحث المتقدم، احفظ العقارات، وتواصل مع الوكلاء بدون تعقيد.',
      steps: [
        { title: 'اكتشاف', text: 'فلترة حسب المدينة والنوع والسعر' },
        { title: 'حفظ', text: 'مفضلة ومقارنات سريعة' },
        { title: 'تواصل', text: 'رسائل مباشرة مع الوكيل' }
      ]
    };
  });

  readonly categories: CategoryCard[] = [
    {
      label: 'فلل فاخرة',
      hint: 'حدائق، مسابح، ومواقع راقية',
      count: '32 عرض',
      icon: 'diamond-outline',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80'
    },
    {
      label: 'شقق عائلية',
      hint: 'قريبة من المدارس والخدمات',
      count: '48 عرض',
      icon: 'home-outline',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80'
    },
    {
      label: 'مكاتب راقية',
      hint: 'مساحات عمل للشركات الحديثة',
      count: '21 عرض',
      icon: 'business-outline',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80'
    },
    {
      label: 'محلات تجارية',
      hint: 'واجهات قوية ومواقع نشطة',
      count: '16 عرض',
      icon: 'storefront-outline',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=700&q=80'
    },
    {
      label: 'أراضي واستثمار',
      hint: 'فرص تطوير ومشاريع مستقبلية',
      count: '13 عرض',
      icon: 'map-outline',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80'
    },
    {
      label: 'كراء مفروش',
      hint: 'حلول جاهزة للسكن الفوري',
      count: '25 عرض',
      icon: 'key-outline',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=700&q=80'
    }
  ];

  readonly vm$ = combineLatest({
    properties: this.propertyService.list(),
    posts: this.feed.list(),
    agents: this.agents.list()
  });

  constructor() {
    addIcons({
      peopleOutline,
      businessOutline,
      trendingUpOutline,
      diamondOutline,
      homeOutline,
      storefrontOutline,
      mapOutline,
      keyOutline,
      trophyOutline
    });
  }
}
