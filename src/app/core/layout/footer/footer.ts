import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { ContactPage } from '../../../shared/models/content.model';
import { MailingListForm } from '../../../features/contact/mailing-list-form/mailing-list-form';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AsyncPipe, MailingListForm],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly content = inject(ContentService);
  readonly contact$ = this.content.getPage<ContactPage>('contact');
  readonly year = new Date().getFullYear();
}
