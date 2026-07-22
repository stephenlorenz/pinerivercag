import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-event-detail',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);

  readonly event$ = this.route.paramMap.pipe(
    map((params) => params.get('slug')),
    switchMap((slug) =>
      this.content.getEvents().pipe(map((items) => items.find((e) => e.slug === slug) ?? null)),
    ),
  );
}
