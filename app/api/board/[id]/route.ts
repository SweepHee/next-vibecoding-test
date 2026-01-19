import { boardService } from "@/feature/board/service/boardService";
import { postSchema } from "@/feature/board/validation/boardSchema";
import { NextResponse } from "next/server";
import { tokenService } from "@/shared/service/tokenService";
import { handleApiError } from "@/shared/utils/errorHandler";
import { NotFoundError, UnauthorizedError } from "@/shared/error/customError";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await boardService.getPostById(parseInt(id));
    if (!post) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    const user = await tokenService.getAuthUser(request);
    const isAuthor = user?.userId === post.authorId;

    return NextResponse.json({ ...post, isAuthor });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await tokenService.getAuthUser(request);
    if (!user) {
      throw new UnauthorizedError("로그인이 필요합니다.");
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = postSchema.parse(body);

    const post = await boardService.updatePost(parseInt(id), validatedData, user.userId);
    return NextResponse.json(post);
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await tokenService.getAuthUser(request);
    if (!user) {
      throw new UnauthorizedError("로그인이 필요합니다.");
    }

    const { id } = await params;
    
    await boardService.deletePost(parseInt(id), user.userId);
    return NextResponse.json({ message: "삭제되었습니다." });
  } catch (error: any) {
    return handleApiError(error);
  }
}
