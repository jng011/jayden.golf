// jayden.golf is the only public address. Any hit on the *.pages.dev
// hostname permanently redirects to the real domain.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname.endsWith('.pages.dev')) {
    url.hostname = 'jayden.golf';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
