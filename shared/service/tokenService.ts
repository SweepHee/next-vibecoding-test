import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-at-least-32-chars-long"
);

export const tokenService = {
  async signJWT(payload: { userId: number; email: string }) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);
  },

  async verifyJWT(token: string) {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload as { userId: number; email: string };
    } catch (error) {
      return null;
    }
  },

  async getAuthUser(req: NextRequest | Request) {
    let token: string | undefined;

    if (req instanceof NextRequest) {
      token = req.cookies.get("token")?.value;
    } else {
      // Standard Request (app router context might need cookies() helper)
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    }

    if (!token) return null;

    return this.verifyJWT(token);
  }
};
