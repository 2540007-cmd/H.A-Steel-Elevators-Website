/* ============================================================
   API: /api/projects/:id
   DELETE -> remove a single project (protected, used by admin.html)
   ============================================================ */

export async function onRequestDelete({ params, request, env }) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${env.ADMIN_PASSWORD}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const data = (await env.PROJECTS_KV.get('projects', { type: 'json' })) || [];
  const filtered = data.filter((p) => p.id !== params.id);

  if (filtered.length === data.length) {
    return new Response('Project not found', { status: 404 });
  }

  await env.PROJECTS_KV.put('projects', JSON.stringify(filtered));
  return Response.json({ success: true });
}
