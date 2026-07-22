import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { Card } from '../../../shared/ui/card/card';

@Component({
  selector: 'app-news-list',
  imports: [AsyncPipe, DatePipe, RouterLink, PageHeader, Card],
  templateUrl: './news-list.html',
  styleUrl: './news-list.scss',
})
export class NewsList {
  private readonly content = inject(ContentService);
  readonly news$ = this.content.getNews();
}
