import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageHeader } from '../../shared/ui/page-header/page-header';

// The org's real Donorbox campaign, carried over from the Squarespace site's
// popup-button embed (donorbox.org/first-campaign-21). Query params match
// what was live there: default to a one-time gift, hide the donation meter.
// Only ever pass this fixed, trusted URL through bypassSecurityTrustResourceUrl
// — never user input.
const DONATE_CAMPAIGN_SLUG = 'first-campaign-21';
const DONATE_CAMPAIGN_PARAMS = 'default_interval=o&hide_donation_meter=true';

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
      `https://donorbox.org/embed/${DONATE_CAMPAIGN_SLUG}?${DONATE_CAMPAIGN_PARAMS}`,
    );
  }
}
