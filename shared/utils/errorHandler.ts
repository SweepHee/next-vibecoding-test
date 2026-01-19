import { NextResponse } from "next/server";
import { PublicError, ServerError } from "../error/customError";
import { ZodError } from "zod";

export function handleApiError(error: any) {
  // PublicError 계열 (BadRequestError, UnauthorizedError 등 포함)
  if (error instanceof PublicError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode }
    );
  }

  // Zod 유효성 검사 에러 처리 (일종의 PublicError로 간주)
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "입력값이 올바르지 않습니다.", errors: error.issues },
      { status: 400 }
    );
  }

  // ServerError 계열 또는 기타 알 수 없는 에러
  console.error("[SERVER_ERROR_LOG]", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    isServerErrorInstance: error instanceof ServerError,
  });

  // ServerError인 경우나 일반 에러인 경우 사용자에게는 상세 내용을 숨김
  return NextResponse.json(
    { message: "알 수 없는 에러입니다. 잠시 후 다시 시도해주세요." },
    { status: 500 }
  );
}
