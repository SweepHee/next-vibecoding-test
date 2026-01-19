import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다.").optional(),
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6글자 이상이어야 합니다."),
  confirmPassword: z.string().min(6, "비밀번호 확인을 입력해주세요."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

export const signinSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
