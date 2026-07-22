import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import {
  BannerAlert,
  EventItem,
  MinutesItem,
  NewsPost,
  SearchDoc,
} from '../../shared/models/content.model';

// Fetches build-time-generated JSON from /assets/content-index (see
// scripts/build-content-index.mjs). Each collection's HTTP call is cached
// via shareReplay so repeated navigation doesn't refetch on every visit.
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Observable<unknown>>();

  private fetch<T>(path: string): Observable<T> {
    if (!this.cache.has(path)) {
      this.cache.set(
        path,
        this.http.get<T>(`/content-index/${path}`).pipe(shareReplay(1)),
      );
    }
    return this.cache.get(path) as Observable<T>;
  }

  getNews(): Observable<NewsPost[]> {
    return this.fetch<NewsPost[]>('news.json');
  }

  getEvents(): Observable<EventItem[]> {
    return this.fetch<EventItem[]>('events.json');
  }

  getMinutes(): Observable<MinutesItem[]> {
    return this.fetch<MinutesItem[]>('minutes.json');
  }

  getBanner(): Observable<BannerAlert> {
    return this.fetch<BannerAlert>('banner.json');
  }

  getPage<T>(name: string): Observable<T> {
    return this.fetch<T>(`pages/${name}.json`);
  }

  getSearchIndex(): Observable<SearchDoc[]> {
    return this.fetch<SearchDoc[]>('search-index.json');
  }
}
