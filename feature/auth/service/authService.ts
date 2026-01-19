import { prisma } from "@/lib/prisma";
import { SigninInput, SignupInput } from "../validation/authSchema";
import bcrypt from "bcryptjs";
import { BadRequestError } from "@/shared/error/customError";

export const authService = {

  async signup(data: SignupInput) {
    const { email, password, name } = data;

    // 중복 이메일 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestError("이미 존재하는 이메일입니다.");
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return user;
  },

  async signin(data: SigninInput) {
    const failMessage = "이메일 혹은 비밀번호가 잘못됐습니다."
    const { email, password } = data;

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestError(failMessage);
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestError(failMessage);
    }

    return user;
  },

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
};
