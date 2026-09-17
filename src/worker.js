/* ============================================================
   H.A Steel Elevators — main Worker
   Handles: /api/projects (GET/POST), /api/projects/:id (DELETE),
   /api/login, /api/logout, /api/upload-image, /images/:key, and
   protecting /admin.html from direct access. Everything else
   falls through to the static site (env.ASSETS).
   ============================================================ */

import { createSessionCookie, clearSessionCookie, verifySession } from './auth.js';

const PROTECTED_PAGES = new Set(['/admin.html', '/admin', '/admin/']);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    // ---------- GET /api/projects ----------
    if (pathname === '/api/projects' && method === 'GET') {
      const data = (await env.PROJECTS_KV.get('projects', { type: 'json' })) || [];
      return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
    }

    // ---------- POST /api/projects ----------
    if (pathname === '/api/projects' && method === 'POST') {
      const valid = await verifySession(request.headers.get('Cookie'), env.ADMIN_PASSWORD);
      if (!valid) return new Response('Unauthorized', { status: 401 });

      const body = await request.json();
      const required = ['title', 'category', 'typeLabel', 'company', 'location', 'year'];
      for (const field of required) {
        if (!body[field]) return new Response(`Missing field: ${field}`, { status: 400 });
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

    // ---------- DELETE /api/projects/:id ----------
    const deleteMatch = pathname.match(/^\/api\/projects\/([^/]+)$/);
    if (deleteMatch && method === 'DELETE') {
      const valid = await verifySession(request.headers.get('Cookie'), env.ADMIN_PASSWORD);
      if (!valid) return new Response('Unauthorized', { status: 401 });

      const id = deleteMatch[1];
      const data = (await env.PROJECTS_KV.get('projects', { type: 'json' })) || [];
      const filtered = data.filter((p) => p.id !== id);
      if (filtered.length === data.length) return new Response('Project not found', { status: 404 });

      await env.PROJECTS_KV.put('projects', JSON.stringify(filtered));
      return Response.json({ success: true });
    }

    // ---------- POST /api/login ----------
    if (pathname === '/api/login' && method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return new Response('Invalid request', { status: 400 });
      }

      if (!body.password || body.password !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ success: false }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const cookie = await createSessionCookie(env.ADMIN_PASSWORD);
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie },
      });
    }

    // ---------- POST /api/logout ----------
    if (pathname === '/api/logout' && method === 'POST') {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearSessionCookie() },
      });
    }

    // ---------- POST /api/upload-image ----------
    if (pathname === '/api/upload-image' && method === 'POST') {
      const valid = await verifySession(request.headers.get('Cookie'), env.ADMIN_PASSWORD);
      if (!valid) return new Response('Unauthorized', { status: 401 });

      const contentType = request.headers.get('Content-Type') || '';
      if (!contentType.startsWith('image/')) {
        return new Response('Expected an image upload', { status: 400 });
      }

      // e.g. "image/webp" -> "webp", "image/svg+xml" -> "svg"
      const ext = contentType.split('/')[1].split('+')[0].split(';')[0] || 'bin';
      const key = `${crypto.randomUUID()}.${ext}`;

      await env.IMAGES.put(key, request.body, {
        httpMetadata: { contentType },
      });

      return Response.json({ url: `/images/${key}` }, { status: 201 });
    }

    // ---------- GET /images/:key ----------
    const imageMatch = pathname.match(/^\/images\/([^/]+)$/);
    if (imageMatch && method === 'GET') {
      const object = await env.IMAGES.get(imageMatch[1]);
      if (!object) return new Response('Not found', { status: 404 });

      return new Response(object.body, {
        headers: {
          'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // ---------- Protect the admin page ----------
    if (PROTECTED_PAGES.has(pathname)) {
      const valid = await verifySession(request.headers.get('Cookie'), env.ADMIN_PASSWORD);
      if (!valid) return Response.redirect(`${url.origin}/login`, 302);
    }

    // ---------- Everything else: serve the static site ----------
    return env.ASSETS.fetch(request);
  },
};
