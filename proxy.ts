import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type Plan = "fondamentaux" | "complet";

const modulePlans: Record<string, Plan> = {
  chatgpt: "fondamentaux",
  prompts: "fondamentaux",
  quotidien: "fondamentaux",
  "comprendre-ia": "fondamentaux",
  automatisation: "fondamentaux",
  python: "complet",
  "api-ia": "complet",
  supabase: "complet",
  "saas-ia": "complet",
  "agents-ia": "complet",
  rag: "complet",
  "projet-final": "complet",
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

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

  if (!requiredPlan || !activeSubscription || !planAllowed) {
    return redirectWithCookies(request, response, "/tarifs");
  }

  return response;
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
  matcher: ["/formation/:path*"],
};
