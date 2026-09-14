/* ============================================================
   API: /api/projects
   GET  -> list all projects (public, used by projects.html)
   POST -> add a new project (protected, used by admin.html)
   ============================================================ */

export async function onRequestGet({ env }) {
  const data = (await env.PROJECTS_KV.get('projects', { type: 'json' })) || [];
  return Response.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function onRequestPost({ request, env }) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${env.ADMIN_PASSWORD}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();

  // Basic validation of required fields
  const required = ['title', 'category', 'typeLabel', 'company', 'location', 'year'];
  for (const field of required) {
    if (!body[field]) {
      return new Response(`Missing field: ${field}`, { status: 400 });
    }
  }

  const project = {
    id: crypto.randomUUID(),
    title: body.title,
    category: body.category,
    typeLabel: body.typeLabel,
    company: body.company,
    location: body.location,
    year: Number(body.year),
    scope: body.scope || '',
    description: body.description || '',
    images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : []),
    createdAt: new Date().toISOString(),
  };

  const data = (await env.PROJECTS_KV.get('projects', { type: 'json' })) || [];
  data.unshift(project);
  await env.PROJECTS_KV.put('projects', JSON.stringify(data));

  return Response.json(project, { status: 201 });
}
