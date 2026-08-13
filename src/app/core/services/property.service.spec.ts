import { TestBed } from '@angular/core/testing';
import { PropertyService, defaultFilters } from './property.service';
import { properties } from './mock-data';

describe('PropertyService', () => {
  let service: PropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyService);
  });

  it('filters properties by city, type, and price range', () => {
    const result = service.applyFilters(properties, {
      ...defaultFilters,
      city: 'الرباط',
      type: 'apartment',
      minPrice: 1000000,
      maxPrice: 2000000
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('p-1');
  });

  it('tracks favorites without duplicating state', () => {
    expect(service.isFavorite('p-2')).toBeFalse();
    service.toggleFavorite('p-2');
    expect(service.isFavorite('p-2')).toBeTrue();
  });
});
