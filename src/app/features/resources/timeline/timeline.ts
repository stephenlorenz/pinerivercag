import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { TimelineEntry } from '../../../shared/models/content.model';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

interface TimelinePage {
  title: string;
  entries: TimelineEntry[];
}

@Component({
  selector: 'app-timeline',
  imports: [AsyncPipe, PageHeader],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  private readonly content = inject(ContentService);
  readonly page$ = this.content.getPage<TimelinePage>('timeline');
}
