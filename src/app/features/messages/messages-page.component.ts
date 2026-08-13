import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonInput, IonItem } from '@ionic/angular/standalone';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Conversation } from '../../core/models/domain.models';
import { MessageService } from '../../core/services/ecosystem.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, FormsModule, IonButton, IonInput, IonItem],
  template: `
    <div class="feature-page">
      <main class="page messages-layout">
        <aside class="conversation-list">
          <button class="conversation" *ngFor="let conversation of conversations$ | async" (click)="select(conversation)" [class.active]="selected()?.id === conversation.id">
            <strong>{{ conversation.participantName }}</strong>
            <span>{{ conversation.lastMessage }}</span>
            <small>{{ conversation.updatedAt | date: 'shortTime' }}</small>
          </button>
        </aside>
        <section class="chat-panel" *ngIf="selected(); else empty">
          <div class="chat-message" *ngFor="let message of messages$ | async" [class.me]="message.sender === 'me'">
            <p>{{ message.text }}</p><small>{{ message.sentAt | date: 'shortTime' }}</small>
          </div>
          <p class="typing">يكتب الآن...</p>
          <ion-item><ion-input [(ngModel)]="draft" placeholder="اكتب رسالة" /><ion-button slot="end" (click)="send()">إرسال</ion-button></ion-item>
        </section>
        <ng-template #empty><section class="empty-state"><h2>اختر محادثة</h2></section></ng-template>
      </main>
    </div>
  `
})
export class MessagesPageComponent {
  private readonly service = inject(MessageService);
  readonly selected = signal<Conversation | null>(null);
  readonly refresh = new BehaviorSubject('');
  draft = '';
  readonly conversations$ = this.service.listConversations();
  readonly messages$ = this.refresh.pipe(switchMap((id) => this.service.getMessages(id)));

  select(conversation: Conversation): void {
    this.selected.set(conversation);
    this.refresh.next(conversation.id);
  }

  send(): void {
    const conversation = this.selected();
    if (!conversation || !this.draft.trim()) {
      return;
    }
    this.service.send(conversation.id, this.draft.trim()).subscribe(() => {
      this.draft = '';
      this.refresh.next(conversation.id);
    });
  }
}
