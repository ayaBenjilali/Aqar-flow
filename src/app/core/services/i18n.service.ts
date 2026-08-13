import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Direction, Language } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly currentLanguage = signal<Language>('ar');

  readonly language = this.currentLanguage.asReadonly();
  readonly direction = computed<Direction>(() => (this.currentLanguage() === 'ar' ? 'rtl' : 'ltr'));

  constructor() {
    this.applyDocumentDirection();
  }

  toggleLanguage(): void {
    this.currentLanguage.update((language) => (language === 'ar' ? 'en' : 'ar'));
    this.applyDocumentDirection();
  }

  setLanguage(language: Language): void {
    this.currentLanguage.set(language);
    this.applyDocumentDirection();
  }

  t(ar: string, en: string): string {
    return this.currentLanguage() === 'ar' ? ar : en;
  }

  private applyDocumentDirection(): void {
    const root = this.document.documentElement;
    root.dir = this.direction();
    root.lang = this.language();
  }
}
