import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Agent, AppNotification, ChatMessage, Company, Conversation, FeedPost, Lead, LeadStatus } from '../models/domain.models';
import { agents, companies, conversations, feedPosts, leads, messages, notifications } from './mock-data';
import { MockApiService } from './mock-api.service';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly api = inject(MockApiService);
  list(): Observable<Agent[]> {
    return this.api.get('/api/agents', agents);
  }
  getById(id: string): Observable<Agent | undefined> {
    return this.api.get(`/api/agents/${id}`, agents.find((agent) => agent.id === id));
  }
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly api = inject(MockApiService);
  list(): Observable<Company[]> {
    return this.api.get('/api/companies', companies);
  }
  getById(id: string): Observable<Company | undefined> {
    return this.api.get(`/api/companies/${id}`, companies.find((company) => company.id === id));
  }
}

@Injectable({ providedIn: 'root' })
export class FeedService {
  private readonly api = inject(MockApiService);
  private readonly posts = signal<FeedPost[]>(feedPosts);
  list(): Observable<FeedPost[]> {
    return this.api.get('/api/feed', this.posts());
  }
  like(postId: string): void {
    this.posts.update((items) => items.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));
  }
  follow(postId: string): void {
    this.posts.update((items) => items.map((post) => (post.id === postId ? { ...post, following: !post.following } : post)));
  }
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly api = inject(MockApiService);
  private readonly items = signal<Lead[]>(leads);
  readonly leads = this.items.asReadonly();

  list(): Observable<Lead[]> {
    return this.api.get('/api/leads', this.items());
  }

  updateStatus(id: string, status: LeadStatus): Observable<Lead | undefined> {
    const updated = this.items().find((lead) => lead.id === id);
    if (!updated) {
      return this.api.get('/api/leads/missing', undefined);
    }

    const next = {
      ...updated,
      status,
      history: [`تم نقل العميل إلى ${status}`, ...updated.history]
    };

    return this.api.put(`/api/leads/${id}`, next).pipe(
      tap((lead) => this.items.update((items) => items.map((item) => (item.id === id && lead ? lead : item))))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly api = inject(MockApiService);
  private readonly conversationItems = signal<Conversation[]>(conversations);
  private readonly messageItems = signal<ChatMessage[]>(messages);

  listConversations(): Observable<Conversation[]> {
    return this.api.get('/api/messages', this.conversationItems());
  }

  getMessages(conversationId: string): Observable<ChatMessage[]> {
    return this.api.get(`/api/messages/${conversationId}`, this.messageItems().filter((message) => message.conversationId === conversationId));
  }

  send(conversationId: string, text: string): Observable<ChatMessage> {
    const message: ChatMessage = {
      id: `msg-${crypto.randomUUID()}`,
      conversationId,
      sender: 'me',
      text,
      sentAt: new Date().toISOString()
    };
    return this.api.post('/api/messages', message).pipe(tap((created) => this.messageItems.update((items) => [...items, created])));
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly api = inject(MockApiService);
  private readonly items = signal<AppNotification[]>(notifications);
  readonly unreadCount = signal(notifications.filter((notification) => !notification.read).length);

  list(): Observable<AppNotification[]> {
    return this.api.get('/api/notifications', this.items());
  }

  markRead(id: string): void {
    this.items.update((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));
    this.unreadCount.set(this.items().filter((notification) => !notification.read).length);
  }
}
