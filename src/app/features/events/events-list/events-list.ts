import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ContentService } from '../../../core/services/content.service';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { Card } from '../../../shared/ui/card/card';

@Component({
  selector: 'app-events-list',
  imports: [AsyncPipe, DatePipe, RouterLink, PageHeader, Card],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss',
})
export class EventsList {
  private readonly content = inject(ContentService);

  readonly upcoming$ = this.content.getEvents().pipe(
    map((items) => items.filter((e) => new Date(e.start_date).getTime() >= Date.now())),
  );
  readonly past$ = this.content.getEvents().pipe(
    map((items) =>
      items
        .filter((e) => new Date(e.start_date).getTime() < Date.now())
        .sort((a, b) => b.start_date.localeCompare(a.start_date)),
    ),
  );
}
