// Lesson-request mailer for jayden.golf.
// Receives the form POST and emails it to Jayden via Cloudflare Email Routing.
// No third-party form service; the send_email binding delivers to the verified
// destination address on this account.
import { EmailMessage } from 'cloudflare:email';

const ALLOWED_ORIGINS = new Set([
  'https://jayden.golf',
  'https://www.jayden.golf',
  'https://jaydengolf.pages.dev',
]);

function cors(origin) {
  const o = ALLOWED_ORIGINS.has(origin) ? origin : 'https://jayden.golf';
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

const esc = (s) => String(s ?? '').slice(0, 2000);

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    if (request.method !== 'POST') return new Response('nope', { status: 405 });

    let d;
    try { d = await request.json(); } catch (e) {
      return Response.json({ success: false, message: 'bad json' }, { status: 400, headers: cors(origin) });
    }
    if (d._honey) return Response.json({ success: true }, { headers: cors(origin) });   // bot trap: pretend it worked
    if (!d.name || !d.email || !d.phone || !d.child_age) {
      return Response.json({ success: false, message: 'missing fields' }, { status: 400, headers: cors(origin) });
    }

    const body = [
      'New lesson request from jayden.golf',
      '',
      'Name:        ' + esc(d.name),
      'Email:       ' + esc(d.email),
      'Phone:       ' + esc(d.phone),
      "Child's age: " + esc(d.child_age),
      'Message:     ' + (esc(d.message) || '(none)'),
    ].join('\r\n');

    const from = 'forms@jayden.golf';
    const to = 'jaydenghiyam@gmail.com';
    const raw =
      'From: Golf w/ Jayden <' + from + '>\r\n' +
      'To: <' + to + '>\r\n' +
      'Reply-To: ' + esc(d.email) + '\r\n' +
      'Subject: New golf lesson request from ' + esc(d.name) + '\r\n' +
      'Message-ID: <' + crypto.randomUUID() + '@jayden.golf>\r\n' +
      'Date: ' + new Date().toUTCString() + '\r\n' +
      'MIME-Version: 1.0\r\n' +
      'Content-Type: text/plain; charset=utf-8\r\n' +
      '\r\n' + body + '\r\n';

    try {
      await env.MAIL.send(new EmailMessage(from, to, raw));
      return Response.json({ success: true }, { headers: cors(origin) });
    } catch (e) {
      return Response.json({ success: false, message: String(e.message || e) }, { status: 500, headers: cors(origin) });
    }
  },
};
