import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST as signupHandler } from './signup/route'
import { POST as signinHandler } from './signin/route'
import { authService } from '@/feature/auth/service/authService'
import { tokenService } from '@/shared/service/tokenService'
import { cookies } from 'next/headers'

// authService 모킹
vi.mock('@/feature/auth/service/authService', () => ({
  authService: {
    signup: vi.fn(),
    signin: vi.fn(),
  },
}))

// tokenService 모킹
vi.mock('@/shared/service/tokenService', () => ({
  tokenService: {
    signJWT: vi.fn(),
  },
}))

// next/headers 모킹
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('Auth API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/signup', () => {
    it('유효한 데이터로 회원가입 요청 시 201 응답을 반환해야 함', async () => {
      // Given
      const signupData = {
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        name: 'New User',
      }
      const mockRequest = new Request('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData),
      })

      vi.mocked(authService.signup).mockResolvedValue({
        id: 1,
        email: signupData.email,
        name: signupData.name,
      } as any)

      // When
      const response = await signupHandler(mockRequest)

      // Then
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.message).toBe('회원가입이 완료되었습니다.')
      expect(authService.signup).toHaveBeenCalled()
    })

    it('잘못된 데이터(비밀번호 불일치) 요청 시 에러를 반환해야 함', async () => {
        // Given
        const signupData = {
          email: 'new@example.com',
          password: 'password123',
          confirmPassword: 'wrongpassword',
        }
        const mockRequest = new Request('http://localhost/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify(signupData),
        })
  
        // When
        const response = await signupHandler(mockRequest)
  
        // Then (Zod validation error handled by handleApiError)
        expect(response.status).toBe(400)
      })
  })

  describe('POST /api/auth/signin', () => {
    it('유효한 정보로 로그인 요청 시 200 응답과 쿠키를 설정해야 함', async () => {
      // Given
      const signinData = {
        email: 'test@example.com',
        password: 'password123',
      }
      const mockRequest = new Request('http://localhost/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(signinData),
      })

      const mockUser = { id: 1, email: signinData.email }
      vi.mocked(authService.signin).mockResolvedValue(mockUser as any)
      vi.mocked(tokenService.signJWT).mockResolvedValue('mock_token')
      
      const mockCookieStore = {
        set: vi.fn(),
      }
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

      // When
      const response = await signinHandler(mockRequest)

      // Then
      expect(response.status).toBe(200)
      expect(tokenService.signJWT).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      })
      expect(mockCookieStore.set).toHaveBeenCalledWith('token', 'mock_token', expect.any(Object))
      
      const body = await response.json()
      expect(body.message).toBe('로그인에 성공했습니다.')
    })
  })
})
