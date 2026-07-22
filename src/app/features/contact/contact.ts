import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { ContactPage } from '../../shared/models/content.model';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { MailingListForm } from './mailing-list-form/mailing-list-form';

@Component({
  selector: 'app-contact',
  imports: [AsyncPipe, PageHeader, MailingListForm],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly content = inject(ContentService);
  readonly contact$ = this.content.getPage<ContactPage>('contact');
}
