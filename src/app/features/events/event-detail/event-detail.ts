import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { ContentService } from '../../../core/services/content.service';
import { pageTitle } from '../../../core/title-strategy';

@Component({
  selector: 'app-event-detail',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);
  private readonly title = inject(Title);

  readonly event$ = this.route.paramMap.pipe(
    map((params) => params.get('slug')),
    switchMap((slug) =>
      this.content.getEvents().pipe(map((items) => items.find((e) => e.slug === slug) ?? null)),
    ),
    tap((event) => {
      if (event) this.title.setTitle(pageTitle(event.title));
    }),
  );
}
