import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { ContentService } from '../../../core/services/content.service';
import { pageTitle } from '../../../core/title-strategy';

@Component({
  selector: 'app-news-detail',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss',
})
export class NewsDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);
  private readonly title = inject(Title);

  readonly post$ = this.route.paramMap.pipe(
    map((params) => params.get('slug')),
    switchMap((slug) => this.content.getNews().pipe(map((items) => items.find((n) => n.slug === slug) ?? null))),
    tap((post) => {
      if (post) this.title.setTitle(pageTitle(post.title));
    }),
  );
}
