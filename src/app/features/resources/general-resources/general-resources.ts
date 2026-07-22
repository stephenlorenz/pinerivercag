import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { LinkItem } from '../../../shared/models/content.model';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { Card } from '../../../shared/ui/card/card';

interface ReadingList {
  heading: string;
  entries: string[];
}

interface GeneralResourcesPage {
  title: string;
  note?: string;
  items: LinkItem[];
  reading_lists?: ReadingList[];
}

@Component({
  selector: 'app-general-resources',
  imports: [AsyncPipe, PageHeader, Card],
  templateUrl: './general-resources.html',
  styleUrl: './general-resources.scss',
})
export class GeneralResources {
  private readonly content = inject(ContentService);
  readonly page$ = this.content.getPage<GeneralResourcesPage>('general-resources');
}
