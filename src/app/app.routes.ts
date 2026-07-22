import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'about', eyebrow: 'About us' },
    title: 'About Us',
  },
  {
    path: 'about/where-we-work',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'where-we-work', eyebrow: 'About us' },
    title: 'Where We Work',
  },
  {
    path: 'about/by-laws',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'bylaws', eyebrow: 'About us' },
    title: 'By-Laws',
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/news-list/news-list').then((m) => m.NewsList),
    title: 'News',
  },
  {
    path: 'news/:slug',
    loadComponent: () =>
      import('./features/news/news-detail/news-detail').then((m) => m.NewsDetail),
    // No static title: NewsDetail sets it once the post loads (see news-detail.ts).
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/events-list/events-list').then((m) => m.EventsList),
    title: 'Events',
  },
  {
    path: 'events/:slug',
    loadComponent: () =>
      import('./features/events/event-detail/event-detail').then((m) => m.EventDetail),
    // No static title: EventDetail sets it once the event loads (see event-detail.ts).
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('./features/resources/general-resources/general-resources').then(
        (m) => m.GeneralResources,
      ),
    title: 'General Resources',
  },
  {
    path: 'resources/conference',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'conference', eyebrow: 'Resources' },
    title: 'Conference',
  },
  {
    path: 'resources/meeting-minutes',
    loadComponent: () =>
      import('./features/resources/meeting-minutes/meeting-minutes').then(
        (m) => m.MeetingMinutes,
      ),
    title: 'Meeting Minutes & Reports',
  },
  {
    path: 'resources/timeline',
    loadComponent: () =>
      import('./features/resources/timeline/timeline').then((m) => m.Timeline),
    title: 'Timeline',
  },
  {
    path: 'resources/lessons',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'lessons', eyebrow: 'Resources' },
    title: 'Lessons',
  },
  {
    path: 'resources/partners',
    loadComponent: () =>
      import('./features/resources/partners/partners').then((m) => m.Partners),
    title: 'Partners',
  },
  {
    path: 'resources/glossary',
    loadComponent: () =>
      import('./features/resources/glossary/glossary').then((m) => m.Glossary),
    title: 'Glossary',
  },
  {
    path: 'resources/photos',
    loadComponent: () => import('./features/resources/photos/photos').then((m) => m.Photos),
    title: 'Photos',
  },
  // resources/poetry-contest: hidden for now (no contest this year); route
  // and nav link removed, content/pages/poetry-contest.json left in place
  // so the page can come straight back if the contest runs again.
  {
    path: 'take-action',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'take-action', eyebrow: 'Get involved' },
    title: 'Take Action',
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then((m) => m.Contact),
    title: 'Contact Us',
  },
  {
    path: 'donate',
    loadComponent: () => import('./features/donate/donate').then((m) => m.Donate),
    title: 'Donate',
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
    title: 'Page Not Found',
  },
];
