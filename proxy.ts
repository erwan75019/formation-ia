import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type Plan = "fondamentaux" | "complet";

const modulePlans: Record<string, Plan> = {
  chatgpt: "fondamentaux",
  prompts: "fondamentaux",
  quotidien: "fondamentaux",
  "comprendre-ia": "fondamentaux",
  automatisation: "fondamentaux",
  "site-web": "complet",
  "api-ia": "complet",
  supabase: "complet",
  "saas-ia": "complet",
  "agents-ia": "complet",
  rag: "complet",
  "projet-final": "complet",
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Ces fichiers sont des ressources publiques, pas des pages de formation.
  // next/image doit pouvoir les lire sans session pour les optimiser.
  if (isPublicFormationAsset(request.nextUrl.pathname)) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (request.nextUrl.pathname === "/inscription") {
      return response;
    }

    return redirectWithCookies(request, response, "/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  const moduleSlug = request.nextUrl.pathname.split("/")[2] ?? "";
  const requiredPlan = modulePlans[moduleSlug];
  const activeSubscription =
    profile?.subscription_status === "active" ||
    profile?.subscription_status === "trialing";
  const plan =
    profile?.plan === "fondamentaux" || profile?.plan === "complet"
      ? profile.plan
      : null;
  const planAllowed =
    requiredPlan === "fondamentaux"
      ? plan === "fondamentaux" || plan === "complet"
      : requiredPlan === "complet" && plan === "complet";

  if (request.nextUrl.pathname === "/inscription") {
    const requestedPlan = request.nextUrl.searchParams.get("plan");
    const checkoutPlan =
      requestedPlan === "fondamentaux" || requestedPlan === "complet"
        ? requestedPlan
        : "fondamentaux";

    return redirectWithCookies(
      request,
      response,
      activeSubscription
        ? "/dashboard"
        : `/abonnement?plan=${checkoutPlan}`
    );
  }

  if (!requiredPlan || !activeSubscription || !planAllowed) {
    return redirectWithCookies(request, response, "/tarifs");
  }

  return response;
}

function isPublicFormationAsset(pathname: string) {
  return (
    pathname.startsWith("/formation/") &&
    /\.(?:avif|gif|jpe?g|png|svg|webp|zip)$/i.test(pathname)
  );
}

function redirectWithCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string
) {
  const redirectResponse = NextResponse.redirect(
    new URL(pathname, request.url)
  );

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export const config = {
  matcher: ["/formation/:path*", "/inscription"],
};
