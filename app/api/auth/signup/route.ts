import { signupSchema } from "@/feature/auth/validation/authSchema";
import { authService } from "@/feature/auth/service/authService";
import { NextResponse } from "next/server";
import { handleApiError } from "@/shared/utils/errorHandler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 밸리데이션
    const validatedData = signupSchema.parse(body);
    
    // 회원가입 서비스 호출
    const user = await authService.signup(validatedData);
    
    // 비밀번호 제외하고 응답
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { message: "회원가입이 완료되었습니다.", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    return handleApiError(error);
  }
}
