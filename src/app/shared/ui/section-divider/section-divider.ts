import { Component, input } from '@angular/core';

// Signature motif: a core-sample stratigraphy band, standing in for the
// sediment layers this task force has spent decades tracking. Used between
// major sections sitewide as a recurring identity marker.
@Component({
  selector: 'app-section-divider',
  templateUrl: './section-divider.html',
  styleUrl: './section-divider.scss',
})
export class SectionDivider {
  readonly depth = input<string>('');
}
