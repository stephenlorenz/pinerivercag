import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ContentService } from '../../core/services/content.service';
import { SectionDivider } from '../../shared/ui/section-divider/section-divider';
import { Card } from '../../shared/ui/card/card';
import { MailingListForm } from '../contact/mailing-list-form/mailing-list-form';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, DatePipe, RouterLink, SectionDivider, Card, MailingListForm],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly content = inject(ContentService);

  readonly news$ = this.content.getNews().pipe(map((items) => items.slice(0, 3)));
  readonly events$ = this.content.getEvents().pipe(
    map((items) =>
      items
        .filter((e) => new Date(e.start_date).getTime() >= Date.now() - 1000 * 60 * 60 * 24)
        .slice(0, 3),
    ),
  );
}
