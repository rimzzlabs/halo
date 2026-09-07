import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { createRequestContext } from "@halo/api";

/** Pages a signed-out reader may open. Everything else needs a session. */
const PUBLIC_PATHS = new Set(["/sign-in", "/sign-up"]);

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;

  // Hono owns /api and builds its own context there.
  if (path.startsWith("/api")) {
    return next();
  }

  const { auth, close } = createRequestContext(env, context.url.origin);

  try {
    // This call also renews a session that has passed its updateAge, which is
    // what keeps a returning reader signed in without a new password.
    const data = await auth.api.getSession({ headers: context.request.headers });

    context.locals.user = data?.user ?? null;
    context.locals.session = data?.session ?? null;

    const isPublic = PUBLIC_PATHS.has(path);

    if (!data && !isPublic) {
      const next = encodeURIComponent(path + context.url.search);
      return context.redirect(`/sign-in?next=${next}`, 302);
    }

    if (data && isPublic) {
      return context.redirect("/", 302);
    }

    const response = await next();

    // A page rendered for one reader must never sit in a shared cache.
    response.headers.set("Cache-Control", "private, no-store");

    return response;
  } finally {
    const cf = context.locals.cfContext;

    if (cf) {
      cf.waitUntil(close());
    } else {
      await close();
    }
  }
});
