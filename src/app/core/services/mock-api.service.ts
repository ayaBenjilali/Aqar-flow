import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  get<T>(endpoint: string, body: T): Observable<T> {
    return of(structuredClone(body)).pipe(delay(this.latency(endpoint)));
  }

  post<TResponse>(endpoint: string, response: TResponse): Observable<TResponse> {
    return of(structuredClone(response)).pipe(delay(this.latency(endpoint)));
  }

  put<TResponse>(endpoint: string, response: TResponse): Observable<TResponse> {
    return of(structuredClone(response)).pipe(delay(this.latency(endpoint)));
  }

  fail<T>(message: string): Observable<T> {
    return throwError(() => new Error(message)).pipe(delay(250));
  }

  private latency(endpoint: string): number {
    return endpoint.includes('auth') ? 350 : 220;
  }
}
