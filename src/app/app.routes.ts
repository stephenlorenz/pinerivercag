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
  },
  {
    path: 'about/where-we-work',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'where-we-work', eyebrow: 'About us' },
  },
  {
    path: 'about/by-laws',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'bylaws', eyebrow: 'About us' },
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/news-list/news-list').then((m) => m.NewsList),
  },
  {
    path: 'news/:slug',
    loadComponent: () =>
      import('./features/news/news-detail/news-detail').then((m) => m.NewsDetail),
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/events-list/events-list').then((m) => m.EventsList),
  },
  {
    path: 'events/:slug',
    loadComponent: () =>
      import('./features/events/event-detail/event-detail').then((m) => m.EventDetail),
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('./features/resources/general-resources/general-resources').then(
        (m) => m.GeneralResources,
      ),
  },
  {
    path: 'resources/conference',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'conference', eyebrow: 'Resources' },
  },
  {
    path: 'resources/meeting-minutes',
    loadComponent: () =>
      import('./features/resources/meeting-minutes/meeting-minutes').then(
        (m) => m.MeetingMinutes,
      ),
  },
  {
    path: 'resources/timeline',
    loadComponent: () =>
      import('./features/resources/timeline/timeline').then((m) => m.Timeline),
  },
  {
    path: 'resources/lessons',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'lessons', eyebrow: 'Resources' },
  },
  {
    path: 'resources/partners',
    loadComponent: () =>
      import('./features/resources/partners/partners').then((m) => m.Partners),
  },
  {
    path: 'resources/glossary',
    loadComponent: () =>
      import('./features/resources/glossary/glossary').then((m) => m.Glossary),
  },
  {
    path: 'resources/photos',
    loadComponent: () => import('./features/resources/photos/photos').then((m) => m.Photos),
  },
  // resources/poetry-contest: hidden for now (no contest this year); route
  // and nav link removed, content/pages/poetry-contest.json left in place
  // so the page can come straight back if the contest runs again.
  {
    path: 'take-action',
    loadComponent: () =>
      import('./features/simple-page/simple-page').then((m) => m.SimplePage),
    data: { pageName: 'take-action', eyebrow: 'Get involved' },
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'donate',
    loadComponent: () => import('./features/donate/donate').then((m) => m.Donate),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
