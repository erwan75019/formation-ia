import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

const privatePrefixes = [
  "/dashboard",
  "/projets",
  "/taches",
  "/calendrier",
  "/parametres",
];

export async function updateSession(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isPrivate = privatePrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = pathname === "/connexion" || pathname === "/inscription";

  if (!user && isPrivate) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return response;
}
