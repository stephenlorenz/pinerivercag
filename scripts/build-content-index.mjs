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

  await writeFile(path.join(outDir, 'news.json'), JSON.stringify(news, null, 2));
  await writeFile(path.join(outDir, 'events.json'), JSON.stringify(events, null, 2));
  await writeFile(path.join(outDir, 'minutes.json'), JSON.stringify(minutes, null, 2));
  await writeFile(path.join(outDir, 'banner.json'), JSON.stringify(banner, null, 2));
  for (const [name, data] of Object.entries(pages)) {
    await writeFile(path.join(outDir, 'pages', `${name}.json`), JSON.stringify(data, null, 2));
  }

  console.log(
    `content-index built: ${news.length} news, ${events.length} events, ${minutes.length} minutes, ${Object.keys(pages).length} pages`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
