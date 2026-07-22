import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavGroup {
  label: string;
  links: { label: string; path: string }[];
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly mobileOpen = signal(false);
  readonly openGroup = signal<string | null>(null);

  readonly groups: NavGroup[] = [
    {
      label: 'About',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Where We Work', path: '/about/where-we-work' },
        { label: 'By-Laws', path: '/about/by-laws' },
        { label: 'News', path: '/news' },
      ],
    },
    {
      label: 'Resources',
      links: [
        { label: 'General Resources', path: '/resources' },
        { label: 'Conference', path: '/resources/conference' },
        { label: 'Meeting Minutes & Reports', path: '/resources/meeting-minutes' },
        { label: 'Timeline', path: '/resources/timeline' },
        { label: 'Lessons', path: '/resources/lessons' },
        { label: 'Partners', path: '/resources/partners' },
        { label: 'Glossary', path: '/resources/glossary' },
        { label: 'Photos', path: '/resources/photos' },
      ],
    },
  ];

  toggleMobile() {
    this.mobileOpen.update((v) => !v);
  }

  toggleGroup(label: string) {
    this.openGroup.update((current) => (current === label ? null : label));
  }

  closeAll() {
    this.mobileOpen.set(false);
    this.openGroup.set(null);
  }
}
