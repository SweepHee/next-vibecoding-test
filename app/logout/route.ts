import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();
  
  // token 쿠키 삭제
  cookieStore.delete("token");
  
  // 메인 페이지로 리다이렉트
  redirect("/");
}
