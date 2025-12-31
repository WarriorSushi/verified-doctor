import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "drsyedirfan93@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminadmin";
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "admin-secret-key-change-in-production"
);

export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
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
