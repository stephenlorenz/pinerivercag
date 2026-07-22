// Reads CMS-authored source files from /content (edited via Decap CMS) and
// emits pre-rendered JSON into src/assets/content-index/, consumed at runtime
// by the Angular app via HttpClient. Markdown is parsed here, at build time,
// so the browser never runs a Markdown parser and never touches raw CMS input.
import { readFile, readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const root = path.resolve(import.meta.dirname, '..');
const contentDir = path.join(root, 'content');
// public/ is copied verbatim to the dist root by Angular's build (see
// angular.json assets config) — src/assets is NOT used by this project.
const outDir = path.join(root, 'public', 'content-index');

function slugFromFilename(filename) {
  return filename.replace(/\.md$/, '');
}

async function readMarkdownCollection(collection) {
  const dir = path.join(contentDir, collection);
  let filenames;
  try {
    filenames = await readdir(dir);
  } catch {
    return [];
  }
  const entries = await Promise.all(
    filenames
      .filter((f) => f.endsWith('.md'))
      .map(async (filename) => {
        const raw = await readFile(path.join(dir, filename), 'utf-8');
        const { data, content } = matter(raw);
        return {
          slug: slugFromFilename(filename),
          ...data,
          bodyHtml: marked.parse(content.trim()),
        };
      }),
  );
  return entries;
}

async function readPagesCollection() {
  const dir = path.join(contentDir, 'pages');
  let filenames;
  try {
    filenames = await readdir(dir);
  } catch {
    return {};
  }
  const pages = {};
  for (const filename of filenames.filter((f) => f.endsWith('.json'))) {
    const raw = await readFile(path.join(dir, filename), 'utf-8');
    const data = JSON.parse(raw);
    if (typeof data.body === 'string') {
      data.bodyHtml = marked.parse(data.body);
    }
    pages[slugFromFilename(filename).replace(/\.json$/, '')] = data;
  }
  return pages;
}

async function readJsonFile(relativePath) {
  const raw = await readFile(path.join(contentDir, relativePath), 'utf-8');
  return JSON.parse(raw);
}

// Route for each `pages` collection entry, matching app.routes.ts. Kept as a
// manual map (same approach as public/admin/config.yml) since this is a
// small, fixed set of pages — poetry-contest is omitted because that page
// and its nav link are currently hidden, so it shouldn't be searchable either.
const PAGE_ROUTES = {
  about: '/about',
  'where-we-work': '/about/where-we-work',
  bylaws: '/about/by-laws',
  'take-action': '/take-action',
  conference: '/resources/conference',
  lessons: '/resources/lessons',
  'general-resources': '/resources',
  timeline: '/resources/timeline',
  partners: '/resources/partners',
  glossary: '/resources/glossary',
  contact: '/contact',
};

function htmlToText(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(text, maxLength = 160) {
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(' ', maxLength)) + '…';
}

function buildSearchIndex({ news, events, minutes, pages }) {
  const docs = [];

  for (const [name, route] of Object.entries(PAGE_ROUTES)) {
    const page = pages[name];
    if (!page) continue;

    switch (name) {
      case 'general-resources': {
        const noteText = page.note ? htmlToText(marked.parse(page.note)) : '';
        docs.push({ title: page.title, section: 'Resources', url: route, excerpt: excerpt(noteText || page.title) });
        for (const item of page.items ?? []) {
          docs.push({
            title: item.title,
            section: 'Resources',
            url: item.url,
            excerpt: excerpt(item.description ?? ''),
          });
        }
        for (const list of page.reading_lists ?? []) {
          for (const entry of list.entries ?? []) {
            docs.push({ title: entry, section: `Resources · ${list.heading}`, url: route, excerpt: entry });
          }
        }
        break;
      }
      case 'timeline':
        for (const entry of page.entries ?? []) {
          docs.push({
            title: `Timeline · ${entry.year}`,
            section: 'Timeline',
            url: route,
            excerpt: entry.event,
          });
        }
        break;
      case 'glossary':
        for (const term of page.terms ?? []) {
          docs.push({
            title: term.term,
            section: 'Glossary',
            url: `${route}?q=${encodeURIComponent(term.term)}`,
            excerpt: term.definition,
          });
        }
        break;
      case 'partners':
        for (const [groupLabel, group] of [
          ['Public Partners', page.public_partners],
          ['Private Stakeholders', page.private_stakeholders],
          ['College & University Partners', page.college_university_partners],
        ]) {
          for (const p of group ?? []) {
            docs.push({
              title: p.name,
              section: `Partners · ${groupLabel}`,
              url: route,
              excerpt: p.description ?? '',
            });
          }
        }
        break;
      case 'contact':
        docs.push({
          title: 'Contact',
          section: 'Contact',
          url: route,
          excerpt: [page.email, page.phone, page.address].filter(Boolean).join(' · '),
        });
        break;
      default: {
        // Simple markdown pages: about, where-we-work, bylaws, take-action,
        // conference, lessons.
        const text = page.body ? htmlToText(marked.parse(page.body)) : '';
        docs.push({ title: page.title, section: 'Pages', url: route, excerpt: excerpt(text) });
      }
    }
  }

  for (const post of news) {
    docs.push({
      title: post.title,
      section: 'News',
      url: `/news/${post.slug}`,
      excerpt: excerpt(post.summary ?? htmlToText(post.bodyHtml ?? '')),
    });
  }
  for (const event of events) {
    docs.push({
      title: event.title,
      section: 'Events',
      url: `/events/${event.slug}`,
      excerpt: excerpt(htmlToText(event.bodyHtml ?? '') || event.location || ''),
    });
  }
  for (const item of minutes) {
    docs.push({
      title: item.title,
      section: 'Meeting Minutes & Reports',
      url: '/resources/meeting-minutes',
      excerpt: excerpt(htmlToText(item.bodyHtml ?? '')),
    });
  }

  return docs;
}

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await mkdir(path.join(outDir, 'pages'), { recursive: true });

  const news = (await readMarkdownCollection('news')).sort((a, b) =>
    String(b.date).localeCompare(String(a.date)),
  );
  const events = (await readMarkdownCollection('events')).sort((a, b) =>
    String(a.start_date).localeCompare(String(b.start_date)),
  );
  const minutes = (await readMarkdownCollection('minutes')).sort((a, b) =>
    String(b.date).localeCompare(String(a.date)),
  );
  const banner = await readJsonFile('banner/banner.json');
  const pages = await readPagesCollection();
  const searchIndex = buildSearchIndex({ news, events, minutes, pages });

  await writeFile(path.join(outDir, 'news.json'), JSON.stringify(news, null, 2));
  await writeFile(path.join(outDir, 'events.json'), JSON.stringify(events, null, 2));
  await writeFile(path.join(outDir, 'minutes.json'), JSON.stringify(minutes, null, 2));
  await writeFile(path.join(outDir, 'banner.json'), JSON.stringify(banner, null, 2));
  await writeFile(path.join(outDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2));
  for (const [name, data] of Object.entries(pages)) {
    await writeFile(path.join(outDir, 'pages', `${name}.json`), JSON.stringify(data, null, 2));
  }

  console.log(
    `content-index built: ${news.length} news, ${events.length} events, ${minutes.length} minutes, ${Object.keys(pages).length} pages, ${searchIndex.length} search docs`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
