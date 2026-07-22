// Serves mailing-list signups collected by Netlify Forms to the
// Identity-gated admin page at /admin/subscribers/. Netlify verifies the
// `Authorization: Bearer <identity-jwt>` header itself before invoking this
// function, populating context.clientContext.user for signed-in requests —
// no separate auth check needed here.
//
// Written as a classic ("v1") handler, not the newer default-export API:
// the automatic Identity JWT verification that populates
// context.clientContext.user only exists on classic Functions.
//
// Requires two environment variables, set in the Netlify dashboard (Site
// settings > Environment variables) — never committed to the repo:
//   NETLIFY_API_TOKEN — a Personal Access Token (User settings > Applications)
//   NETLIFY_SITE_ID   — this site's ID (Site settings > General > Site details)

export const handler = async (event, context) => {
  if (!context.clientContext?.user) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const token = process.env.NETLIFY_API_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;
  if (!token || !siteId) {
    return {
      statusCode: 500,
      body: 'Server misconfigured: missing NETLIFY_API_TOKEN or NETLIFY_SITE_ID',
    };
  }

  const apiHeaders = { Authorization: `Bearer ${token}` };

  const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
    headers: apiHeaders,
  });
  if (!formsRes.ok) {
    return { statusCode: 502, body: 'Failed to look up forms' };
  }
  const forms = await formsRes.json();
  const form = forms.find((f) => f.name === 'mailing-list');
  if (!form) {
    return respond(event, []);
  }

  const subsRes = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, {
    headers: apiHeaders,
  });
  if (!subsRes.ok) {
    return { statusCode: 502, body: 'Failed to fetch submissions' };
  }
  const submissions = await subsRes.json();

  const rows = submissions
    .map((s) => ({
      name: s.data?.name ?? '',
      email: s.data?.email ?? '',
      submitted_at: s.created_at,
    }))
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  return respond(event, rows);
};

function respond(event, rows) {
  if (event.queryStringParameters?.format === 'csv') {
    const csv = [
      'name,email,submitted_at',
      ...rows.map((r) => [r.name, r.email, r.submitted_at].map(csvEscape).join(',')),
    ].join('\n');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="mailing-list.csv"',
      },
      body: csv,
    };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rows),
  };
}

function csvEscape(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
