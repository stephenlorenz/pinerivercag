import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
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
  private readonly router = inject(Router);
  readonly contact$ = this.content.getPage<ContactPage>('contact');
  readonly year = new Date().getFullYear();

  // The footer lives outside <router-outlet>, so it isn't re-created per
  // route — track navigation to know when we're already on /contact and
  // can hide the redundant "Full contact page" link.
  readonly onContactPage = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects === '/contact'),
    ),
    { initialValue: this.router.url === '/contact' },
  );
}
