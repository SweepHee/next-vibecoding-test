import { signinSchema } from "@/feature/auth/validation/authSchema";
import { authService } from "@/feature/auth/service/authService";
import { tokenService } from "@/shared/service/tokenService";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleApiError } from "@/shared/utils/errorHandler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 밸리데이션
    const validatedData = signinSchema.parse(body);
    
    // 로그인 서비스 호출
    const user = await authService.signin(validatedData);
    
    // 비밀번호 제외하고 응답
    const { password: _, ...userWithoutPassword } = user;
    
    // JWT 생성
    const token = await tokenService.signJWT({
      userId: user.id,
      email: user.email,
    });

    // 쿠키 설정
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    return NextResponse.json(
      { message: "로그인에 성공했습니다.", user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error: any) {
    return handleApiError(error);
  }
}
