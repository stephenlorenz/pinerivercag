// Serves mailing-list signups collected by Netlify Forms to the
// Identity-gated admin page at /admin/subscribers/. Netlify verifies the
// `Authorization: Bearer <identity-jwt>` header itself before invoking this
// function, so context.clientContext.user is only populated for signed-in,
// Identity-authenticated requests — no separate auth check needed here.
//
// Requires two environment variables, set in the Netlify dashboard (Site
// settings > Environment variables) — never committed to the repo:
//   NETLIFY_API_TOKEN — a Personal Access Token (User settings > Applications)
//   NETLIFY_SITE_ID   — this site's ID (Site settings > General > Site details)

export default async (req, context) => {
  if (!context.clientContext?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = process.env.NETLIFY_API_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;
  if (!token || !siteId) {
    return new Response('Server misconfigured: missing NETLIFY_API_TOKEN or NETLIFY_SITE_ID', {
      status: 500,
    });
  }

  const apiHeaders = { Authorization: `Bearer ${token}` };

  const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
    headers: apiHeaders,
  });
  if (!formsRes.ok) {
    return new Response('Failed to look up forms', { status: 502 });
  }
  const forms = await formsRes.json();
  const form = forms.find((f) => f.name === 'mailing-list');
  if (!form) {
    return jsonOrCsv(req, []);
  }

  const subsRes = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, {
    headers: apiHeaders,
  });
  if (!subsRes.ok) {
    return new Response('Failed to fetch submissions', { status: 502 });
  }
  const submissions = await subsRes.json();

  const rows = submissions
    .map((s) => ({
      name: s.data?.name ?? '',
      email: s.data?.email ?? '',
      submitted_at: s.created_at,
    }))
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  return jsonOrCsv(req, rows);
};

function jsonOrCsv(req, rows) {
  const url = new URL(req.url);
  if (url.searchParams.get('format') === 'csv') {
    const csv = [
      'name,email,submitted_at',
      ...rows.map((r) => [r.name, r.email, r.submitted_at].map(csvEscape).join(',')),
    ].join('\n');
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="mailing-list.csv"',
      },
    });
  }
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
}

function csvEscape(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
