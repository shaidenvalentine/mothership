"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { loginAction } from "../actions";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form
      action={formAction}
      className="w-full max-w-sm rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-8"
    >
      <span className="ms-caption">Mothership Ops</span>
      <h1 className="mt-3 font-display text-display-md text-ms-bone">
        Admin sign in
      </h1>
      <p className="mt-2 text-body text-ms-fog">
        Enter the shared admin password to continue.
      </p>

      <input type="hidden" name="next" value={next} />
      <label className="mt-8 block text-sm text-ms-fog" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        className="mt-2 w-full rounded-md border border-ms-graphite bg-ms-black px-4 py-3 text-ms-bone outline-none focus:border-ms-ion"
      />

      {state?.error ? (
        <p className="mt-3 text-sm text-ms-danger">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-md bg-ms-bone px-4 py-3 font-medium text-ms-black transition hover:bg-ms-paper disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ms-black px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
