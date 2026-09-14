import { verifySession } from './_utils/auth.js';

// Cloudflare Pages serves an .html file at both its full path and the
// extensionless version (e.g. /admin.html AND /admin), so both must be
// protected here.
const PROTECTED_PATHS = new Set(['/admin.html', '/admin', '/admin/']);

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);

  if (PROTECTED_PATHS.has(url.pathname)) {
    const cookie = request.headers.get('Cookie');
    const valid = await verifySession(cookie, env.ADMIN_PASSWORD);

    if (!valid) {
      return Response.redirect(`${url.origin}/login`, 302);
    }
  }

  return next();
}
