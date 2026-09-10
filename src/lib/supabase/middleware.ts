import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import { hasAdminAccess } from "@/lib/auth/roles";
import { getOptionalSupabasePublicEnv } from "@/lib/utilities/env";
import { getSafeRedirectPath } from "@/lib/utilities/redirect";
import type { Database, Profile } from "@/types/database";

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminPublicAuthPath(pathname: string): boolean {
  return (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname === "/admin/forgot-password" ||
    pathname.startsWith("/admin/forgot-password/")
  );
}

function redirectWithCookies(url: URL, source: NextResponse) {
  const response = NextResponse.redirect(url);

  source.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  return response;
}

async function getProfileForUser(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function updateSession(request: NextRequest) {
  const env = getOptionalSupabasePublicEnv();

  if (!env) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(env.url, env.publicKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, cacheHeaders) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });

        Object.entries(cacheHeaders).forEach(([key, value]) => {
          supabaseResponse.headers.set(key, value);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const profile = user ? await getProfileForUser(supabase, user.id) : null;
  const canAccessAdmin = hasAdminAccess(profile);

  if (isAdminPath(pathname) && !isAdminPublicAuthPath(pathname)) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return redirectWithCookies(loginUrl, supabaseResponse);
    }

    if (!canAccessAdmin) {
      await supabase.auth.signOut();
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      loginUrl.searchParams.set("error", "forbidden");
      return redirectWithCookies(loginUrl, supabaseResponse);
    }
  }

  if (user && canAccessAdmin && isAdminPublicAuthPath(pathname)) {
    const destination = request.nextUrl.clone();
    destination.pathname = getSafeRedirectPath(
      request.nextUrl.searchParams.get("next"),
    );
    destination.search = "";
    return redirectWithCookies(destination, supabaseResponse);
  }

  return supabaseResponse;
}
