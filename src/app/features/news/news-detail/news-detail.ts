import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-news-detail',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss',
})
export class NewsDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);

  readonly post$ = this.route.paramMap.pipe(
    map((params) => params.get('slug')),
    switchMap((slug) => this.content.getNews().pipe(map((items) => items.find((n) => n.slug === slug) ?? null))),
  );
}
