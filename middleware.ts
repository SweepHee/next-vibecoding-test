import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { tokenService } from '@/shared/service/tokenService'

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request
  const token = cookies.get('token')?.value

  // JWT 검증
  const isAuthenticated = token ? await tokenService.verifyJWT(token) : null

  const isBoardRoute = nextUrl.pathname.startsWith('/board')
  const isAuthPageRoute = nextUrl.pathname === '/signin' || nextUrl.pathname === '/signup'

  // 로그인이 필요한 페이지에 접근했는데 토큰이 없는 경우
  if (isBoardRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL('/signin', request.url))
    // 쿠키가 유효하지 않은 경우를 대비해 삭제 처리
    if (token) {
      response.cookies.delete('token')
    }
    return response
  }

  // 로그인된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (isAuthPageRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/board', request.url))
  }

  return NextResponse.next()
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    '/board/:path*',
    '/signin',
    '/signup',
  ],
}
