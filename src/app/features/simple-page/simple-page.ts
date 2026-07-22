import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { map, switchMap } from 'rxjs';
import { ContentService } from '../../core/services/content.service';
import { SimplePage as SimplePageModel } from '../../shared/models/content.model';
import { PageHeader } from '../../shared/ui/page-header/page-header';

// Generic renderer for CMS "pages" collection entries that are just a
// title + Markdown body (about, where-we-work, by-laws, take-action,
// conference, lessons, poetry-contest). Which page to load comes from the
// route's `data.pageName` / `data.eyebrow` (see app.routes.ts).
@Component({
  selector: 'app-simple-page',
  imports: [AsyncPipe, PageHeader],
  templateUrl: './simple-page.html',
  styleUrl: './simple-page.scss',
})
export class SimplePage {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);

  readonly eyebrow = (this.route.snapshot.data['eyebrow'] as string) ?? '';

  readonly page$ = this.route.data.pipe(
    map((data) => data['pageName'] as string),
    switchMap((pageName) => this.content.getPage<SimplePageModel>(pageName)),
  );
}
