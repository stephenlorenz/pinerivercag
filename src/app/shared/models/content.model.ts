export interface NewsPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  image: string | null;
  bodyHtml: string;
}

export interface EventItem {
  slug: string;
  title: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  rsvp_link: string | null;
  bodyHtml: string;
}

export interface MinutesItem {
  slug: string;
  title: string;
  date: string;
  file: string | null;
  bodyHtml: string;
}

export interface BannerAlert {
  enabled: boolean;
  message: string;
  link: string;
  linkText: string;
  style: 'info' | 'warning' | 'urgent';
}

export interface LinkItem {
  name?: string;
  title?: string;
  url: string;
  description?: string;
}

export interface TimelineEntry {
  year: string;
  event: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface PhotoItem {
  image: string | null;
  caption: string;
}

export interface SimplePage {
  title: string;
  body?: string;
  bodyHtml?: string;
  image?: string | null;
  image_visible?: boolean;
  image_caption?: string;
}

export interface PartnersPage {
  title: string;
  public_partners: LinkItem[];
  private_stakeholders: LinkItem[];
  college_university_partners: LinkItem[];
}

export interface ContactPage {
  email: string;
  phone: string;
  address: string;
}
