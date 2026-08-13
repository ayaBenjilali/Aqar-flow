import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Property, PropertyFilters } from '../models/domain.models';
import { properties } from './mock-data';
import { MockApiService } from './mock-api.service';

export const defaultFilters: PropertyFilters = {
  query: '',
  city: '',
  transaction: '',
  type: '',
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  bathrooms: null,
  minArea: null,
  furnished: null,
  parking: null,
  status: '',
  sort: 'latest'
};

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly api = inject(MockApiService);
  private readonly items = signal<Property[]>(properties);
  private readonly favoriteIds = signal<Set<string>>(new Set(['p-1']));
  readonly filters = signal<PropertyFilters>({ ...defaultFilters });

  readonly featured = computed(() => this.items().filter((property) => property.featured));
  readonly favorites = computed(() => this.items().filter((property) => this.favoriteIds().has(property.id)));

  list(): Observable<Property[]> {
    return this.api.get('/api/properties', this.items());
  }

  search(filters = this.filters()): Observable<Property[]> {
    return this.list().pipe(map((items) => this.applyFilters(items, filters)));
  }

  getById(id: string): Observable<Property | undefined> {
    return this.api.get(`/api/properties/${id}`, this.items().find((property) => property.id === id));
  }

  create(payload: Omit<Property, 'id' | 'createdAt'>): Observable<Property> {
    const property: Property = {
      ...payload,
      id: `p-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString()
    };

    return this.api.post('/api/properties', property).pipe(tap((created) => this.items.update((items) => [created, ...items])));
  }

  toggleFavorite(id: string): void {
    this.favoriteIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  isFavorite(id: string): boolean {
    return this.favoriteIds().has(id);
  }

  updateFilters(filters: Partial<PropertyFilters>): void {
    this.filters.update((current) => ({ ...current, ...filters }));
  }

  resetFilters(): void {
    this.filters.set({ ...defaultFilters });
  }

  applyFilters(items: Property[], filters: PropertyFilters): Property[] {
    const query = filters.query.trim().toLowerCase();
    const result = items.filter((property) => {
      const matchesQuery = !query || [property.title, property.titleEn, property.city, property.district].join(' ').toLowerCase().includes(query);
      const matchesCity = !filters.city || property.city === filters.city;
      const matchesTransaction = !filters.transaction || property.transaction === filters.transaction;
      const matchesType = !filters.type || property.type === filters.type;
      const matchesMinPrice = filters.minPrice === null || property.price >= filters.minPrice;
      const matchesMaxPrice = filters.maxPrice === null || property.price <= filters.maxPrice;
      const matchesBedrooms = filters.bedrooms === null || property.bedrooms >= filters.bedrooms;
      const matchesBathrooms = filters.bathrooms === null || property.bathrooms >= filters.bathrooms;
      const matchesArea = filters.minArea === null || property.area >= filters.minArea;
      const matchesFurnished = filters.furnished === null || property.furnished === filters.furnished;
      const matchesParking = filters.parking === null || property.parking === filters.parking;
      const matchesStatus = !filters.status || property.status === filters.status;

      return (
        matchesQuery &&
        matchesCity &&
        matchesTransaction &&
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesArea &&
        matchesFurnished &&
        matchesParking &&
        matchesStatus
      );
    });

    return result.sort((a, b) => {
      switch (filters.sort) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'areaDesc':
          return b.area - a.area;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }

  activeFilterCount(filters = this.filters()): number {
    return Object.entries(filters).filter(([key, value]) => key !== 'sort' && value !== '' && value !== null).length;
  }
}
