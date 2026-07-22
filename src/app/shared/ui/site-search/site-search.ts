import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Fuse from 'fuse.js';
import { ContentService } from '../../../core/services/content.service';
import { SearchDoc } from '../../models/content.model';

// Site-wide search over the build-time search-index.json (see
// scripts/build-content-index.mjs). Fuse.js runs entirely client-side —
// no backend search service, consistent with this being a static SPA.
@Component({
  selector: 'app-site-search',
  imports: [FormsModule],
  templateUrl: './site-search.html',
  styleUrl: './site-search.scss',
})
export class SiteSearch {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  private readonly docs = toSignal(this.content.getSearchIndex());

  private readonly fuse = computed(
    () =>
      new Fuse(this.docs() ?? [], {
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'excerpt', weight: 0.3 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
  );

  readonly isOpen = signal(false);
  readonly query = signal('');
  readonly activeIndex = signal(0);

  @ViewChild('searchInput') private searchInputRef?: ElementRef<HTMLInputElement>;

  readonly results = computed<SearchDoc[]>(() => {
    const q = this.query().trim();
    if (q.length < 2) return [];
    return this.fuse()
      .search(q)
      .slice(0, 8)
      .map((r) => r.item);
  });

  open() {
    this.isOpen.set(true);
    this.activeIndex.set(0);
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.searchInputRef?.nativeElement.focus());
  }

  close() {
    this.isOpen.set(false);
    this.query.set('');
    this.activeIndex.set(0);
    document.body.style.overflow = '';
  }

  onQueryChange(value: string) {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  select(doc: SearchDoc) {
    this.close();
    this.router.navigateByUrl(doc.url);
  }

  onInputKeydown(event: KeyboardEvent) {
    const results = this.results();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      const doc = results[this.activeIndex()];
      if (doc) this.select(doc);
    } else if (event.key === 'Escape') {
      this.close();
    }
  }

  // "/" opens search from anywhere on the site, unless the user is already
  // typing in some other field.
  @HostListener('window:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent) {
    if (this.isOpen()) return;
    const target = event.target as HTMLElement;
    const typingElsewhere =
      ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;
    if (event.key === '/' && !typingElsewhere) {
      event.preventDefault();
      this.open();
    }
  }
}
