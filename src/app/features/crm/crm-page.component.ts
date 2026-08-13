import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { LeadStatus } from '../../core/models/domain.models';
import { LeadService } from '../../core/services/ecosystem.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, FormsModule, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption],
  template: `
    <div class="feature-page">
      <main class="page">
        <section class="section-header">
          <div>
            <p>CRM</p>
            <h1>لوحة العملاء المحتملين</h1>
          </div>
        </section>

        <div class="toolbar-row">
          <ion-item>
            <ion-label position="stacked">بحث</ion-label>
            <ion-input [(ngModel)]="query" (ionInput)="refresh.next(null)" />
          </ion-item>
        </div>

        <section class="kanban" *ngIf="board$ | async as board">
          <article class="kanban-column" *ngFor="let status of statuses">
            <h2>{{ labels[status] }}</h2>
            <div class="lead-card" *ngFor="let lead of board[status]">
              <strong>{{ lead.clientName }}</strong>
              <span>{{ lead.phone }}</span>
              <p>{{ lead.notes }}</p>
              <small>المتابعة: {{ lead.nextFollowUp | date: 'short' }}</small>
              <ion-item>
                <ion-label>الحالة</ion-label>
                <ion-select [ngModel]="lead.status" (ngModelChange)="move(lead.id, $event)" interface="popover">
                  <ion-select-option *ngFor="let option of statuses" [value]="option">{{ labels[option] }}</ion-select-option>
                </ion-select>
              </ion-item>
            </div>
          </article>
        </section>
      </main>
    </div>
  `
})
export class CrmPageComponent {
  private readonly leads = inject(LeadService);
  readonly refresh = new BehaviorSubject<null>(null);
  query = '';
  readonly statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'viewing', 'negotiation', 'won', 'lost'];
  readonly labels: Record<LeadStatus, string> = {
    new: 'جديد',
    contacted: 'تم التواصل',
    qualified: 'مؤهل',
    viewing: 'زيارة مجدولة',
    negotiation: 'تفاوض',
    won: 'مكتسب',
    lost: 'مفقود'
  };
  readonly board$ = this.refresh.pipe(
    switchMap(() => this.leads.list()),
    map((items) =>
      this.statuses.reduce(
        (board, status) => ({
          ...board,
          [status]: items.filter((lead) => lead.status === status && lead.clientName.includes(this.query))
        }),
        {} as Record<LeadStatus, typeof items>
      )
    )
  );

  move(id: string, status: LeadStatus): void {
    this.leads.updateStatus(id, status).subscribe(() => this.refresh.next(null));
  }
}
