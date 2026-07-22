import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { BannerAlert } from '../../../shared/models/content.model';

interface DisplayBanner extends BannerAlert {
  hash: string;
}

@Component({
  selector: 'app-banner-alert',
  templateUrl: './banner-alert.html',
  styleUrl: './banner-alert.scss',
})
export class BannerAlertComponent {
  private readonly content = inject(ContentService);
  readonly banner = signal<DisplayBanner | null>(null);

  private static readonly DISMISSED_KEY = 'bannerDismissedHash';

  constructor() {
    this.content.getBanner().subscribe((banner) => {
      if (!banner.enabled || !banner.message) {
        this.banner.set(null);
        return;
      }
      const hash = this.hash(banner.message + banner.link);
      const dismissed = localStorage.getItem(BannerAlertComponent.DISMISSED_KEY);
      this.banner.set(dismissed === hash ? null : { ...banner, hash });
    });
  }

  dismiss() {
    const current = this.banner();
    if (current) {
      localStorage.setItem(BannerAlertComponent.DISMISSED_KEY, current.hash);
    }
    this.banner.set(null);
  }

  // Cheap non-cryptographic hash — only used to detect "has this exact
  // message+link been dismissed before", not for anything security-sensitive.
  private hash(input: string): string {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
      h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
    }
    return h.toString(36);
  }
}
