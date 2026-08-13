import { TestBed } from '@angular/core/testing';
import { LeadService } from './ecosystem.service';

describe('LeadService', () => {
  it('updates lead status and records activity history', (done) => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(LeadService);

    service.updateStatus('l-1', 'contacted').subscribe((lead) => {
      expect(lead?.status).toBe('contacted');
      expect(lead?.history[0]).toContain('contacted');
      done();
    });
  });
});
