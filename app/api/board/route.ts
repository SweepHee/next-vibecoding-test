import { boardService } from "@/feature/board/service/boardService";
import { postSchema } from "@/feature/board/validation/boardSchema";
import { NextResponse } from "next/server";
import { tokenService } from "@/shared/service/tokenService";
import { handleApiError } from "@/shared/utils/errorHandler";
import { UnauthorizedError } from "@/shared/error/customError";

export async function GET() {
  try {
    const posts = await boardService.getPosts();
    return NextResponse.json(posts);
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await tokenService.getAuthUser(request);
    if (!user) {
      throw new UnauthorizedError("로그인이 필요합니다.");
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    const post = await boardService.createPost(validatedData, user.userId);
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return handleApiError(error);
  }
}
