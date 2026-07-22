import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Netlify's form-detection crawler only scans static HTML at build time, so
// it can't see a form rendered client-side by Angular. public/forms/mailing-list.html
// ships a hidden static twin with matching field names so Netlify registers
// the form; this component submits to it at runtime via a normal POST.
@Component({
  selector: 'app-mailing-list-form',
  imports: [FormsModule],
  templateUrl: './mailing-list-form.html',
  styleUrl: './mailing-list-form.scss',
})
export class MailingListForm {
  private readonly http = inject(HttpClient);

  name = '';
  email = '';
  botField = '';
  readonly status = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

  submit() {
    if (this.botField) {
      // Honeypot field caught a bot — silently succeed without submitting.
      this.status.set('success');
      return;
    }
    this.status.set('submitting');
    const body = new URLSearchParams({
      'form-name': 'mailing-list',
      name: this.name,
      email: this.email,
      'bot-field': '',
    }).toString();

    this.http
      .post('/', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.status.set('success');
          this.name = '';
          this.email = '';
        },
        error: () => this.status.set('error'),
      });
  }
}
