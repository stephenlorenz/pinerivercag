import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { Card } from '../../../shared/ui/card/card';

@Component({
  selector: 'app-meeting-minutes',
  imports: [AsyncPipe, DatePipe, PageHeader, Card],
  templateUrl: './meeting-minutes.html',
  styleUrl: './meeting-minutes.scss',
})
export class MeetingMinutes {
  private readonly content = inject(ContentService);
  readonly minutes$ = this.content.getMinutes();
}
