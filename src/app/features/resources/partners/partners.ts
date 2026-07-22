import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { PartnersPage } from '../../../shared/models/content.model';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-partners',
  imports: [AsyncPipe, PageHeader],
  templateUrl: './partners.html',
  styleUrl: './partners.scss',
})
export class Partners {
  private readonly content = inject(ContentService);
  readonly page$ = this.content.getPage<PartnersPage>('partners');
}
