import { prisma } from "@/lib/prisma";
import { PostInput } from "../validation/boardSchema";
import { ForbiddenError, NotFoundError } from "@/shared/error/customError";

export const boardService = {
  async getPosts() {
    return prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async getPostById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async createPost(data: PostInput, authorId: number) {
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: authorId
      }
    });
  },

  async updatePost(id: number, data: PostInput, authorId: number) {
    // 권한 확인
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenError("수정 권한이 없습니다.");
    }

    return prisma.post.update({
      where: { id },
      data,
    });
  },

  async deletePost(id: number, authorId: number) {
    // 권한 확인
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenError("삭제 권한이 없습니다.");
    }

    return prisma.post.delete({
      where: { id },
    });
  },
};
