import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageHeader } from '../../shared/ui/page-header/page-header';

// Replace DONATE_CAMPAIGN_SLUG with the org's real Donorbox campaign slug
// (donorbox.org/embed/<slug>) before launch. Only ever pass this fixed,
// trusted URL through bypassSecurityTrustResourceUrl — never user input.
const DONATE_CAMPAIGN_SLUG = 'pine-river-superfund-citizen-task-force';

@Component({
  selector: 'app-donate',
  imports: [PageHeader],
  templateUrl: './donate.html',
  styleUrl: './donate.scss',
})
export class Donate {
  readonly donorboxUrl: SafeResourceUrl;

  constructor(sanitizer: DomSanitizer) {
    this.donorboxUrl = sanitizer.bypassSecurityTrustResourceUrl(
      `https://donorbox.org/embed/${DONATE_CAMPAIGN_SLUG}`,
    );
  }
}
