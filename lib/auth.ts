/**
 * Shared-password admin auth.
 *
 * Only Shaiden + Brandon use the admin, so a single shared password is enough.
 * On success we mint a short-lived JWT (jose, HS256) and store it in an
 * httpOnly cookie; `middleware.ts` verifies it on every /admin request (edge
 * safe — no DB needed). Token verification is split out from the next/headers
 * cookie helpers so the middleware can import only the pure part.
 */
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ms_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/** Dev fallback so the admin is usable locally before env vars are set. */
const DEV_PASSWORD = "mothership-admin";
const DEV_SECRET = "dev-only-insecure-secret-change-me";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEV_PASSWORD;
}

function secretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET || DEV_SECRET;
  return new TextEncoder().encode(secret);
}

/** Constant-time string compare to avoid leaking length/early-exit timing. */
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  // Compare against a fixed length so mismatched lengths still take the full loop.
  const len = Math.max(ab.length, bb.length);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < len; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

export function verifyPassword(input: string): boolean {
  return timingSafeEqual(input, adminPassword());
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

/** Returns true if the token is a valid, unexpired admin session. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
