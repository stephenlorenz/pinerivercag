import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const SITE_NAME = 'Pine River Superfund Citizen Task Force';

export function pageTitle(title: string): string {
  return `${title} · ${SITE_NAME}`;
}

// Routes set a plain `title: '...'` (see app.routes.ts) and this strategy
// appends the site name to it, so that string only lives in one place.
// Routes with no static title (news/:slug, events/:slug — the title isn't
// known until the post/event loads) fall back to the site name alone; those
// components then call Title.setTitle(pageTitle(...)) themselves once their
// content arrives.
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    this.title.setTitle(title ? pageTitle(title) : SITE_NAME);
  }
}
