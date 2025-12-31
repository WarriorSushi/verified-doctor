import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// Production security: These MUST be set in environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

// Validate required environment variables at startup
function validateEnvVars() {
  const missing: string[] = [];
  if (!ADMIN_EMAIL) missing.push("ADMIN_EMAIL");
  if (!ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
  if (!ADMIN_JWT_SECRET) missing.push("ADMIN_JWT_SECRET");

  if (missing.length > 0) {
    throw new Error(
      `Missing required admin environment variables: ${missing.join(", ")}. ` +
      `Please set these in your .env.local or production environment.`
    );
  }
}

// Call validation when module loads (will throw if vars missing)
if (typeof window === "undefined") {
  validateEnvVars();
}

const JWT_SECRET = new TextEncoder().encode(ADMIN_JWT_SECRET);

export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  // Extra safety check in case validation was somehow bypassed
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Admin credentials not configured");
    return false;
  }
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export async function createAdminSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return false;
    }

    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
