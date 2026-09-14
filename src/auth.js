/* ============================================================
   Shared auth helper: signed session cookie.
   Uses ADMIN_PASSWORD itself as the HMAC signing secret, so no
   extra secret needs to be configured. The cookie value is
   "<expiryTimestamp>.<hmacSignatureHex>" — HttpOnly, so it can
   never be read or forged from client-side JS.
   ============================================================ */

const encoder = new TextEncoder();
const COOKIE_NAME = 'admin_session';
const SESSION_HOURS = 24;

async function getKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSessionCookie(secret) {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(String(expires)));
  const value = `${expires}.${toHex(sig)}`;
  return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_HOURS * 3600}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export async function verifySession(cookieHeader, secret) {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;

  const [expiresStr, sigHex] = match[1].split('.');
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires || !sigHex) return false;

  const key = await getKey(secret);
  const expectedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(String(expires)));
  const expectedHex = toHex(expectedSig);

  return expectedHex === sigHex;
}
