import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './authService'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { BadRequestError } from '@/shared/error/customError'

// Prisma 모킹
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// bcrypt 모킹
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signup', () => {
    const signupData = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      name: 'Test User',
    }

    it('이메일이 중복되지 않으면 새로운 사용자를 생성해야 함', async () => {
      // Given
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password' as never)
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 1,
        email: signupData.email,
        name: signupData.name,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      // When
      const result = await authService.signup(signupData)

      // Then
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: signupData.email } })
      expect(bcrypt.hash).toHaveBeenCalledWith(signupData.password, 10)
      expect(prisma.user.create).toHaveBeenCalled()
      expect(result.email).toBe(signupData.email)
    })

    it('이미 존재하는 이메일이면 BadRequestError를 던져야 함', async () => {
      // Given
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 1 } as any)

      // When & Then
      await expect(authService.signup(signupData)).rejects.toThrow(BadRequestError)
      await expect(authService.signup(signupData)).rejects.toThrow('이미 존재하는 이메일입니다.')
    })
  })

  describe('signin', () => {
    const signinData = {
      email: 'test@example.com',
      password: 'password123',
    }

    it('유효한 정보로 로그인하면 사용자 정보를 반환해야 함', async () => {
      // Given
      const mockUser = {
        id: 1,
        email: signinData.email,
        password: 'hashed_password',
      }
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      // When
      const result = await authService.signin(signinData)

      // Then
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: signinData.email } })
      expect(bcrypt.compare).toHaveBeenCalledWith(signinData.password, mockUser.password)
      expect(result.id).toBe(mockUser.id)
    })

    it('사용자가 존재하지 않으면 BadRequestError를 던져야 함', async () => {
      // Given
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      // When & Then
      await expect(authService.signin(signinData)).rejects.toThrow(BadRequestError)
    })

    it('비밀번호가 일치하지 않으면 BadRequestError를 던져야 함', async () => {
      // Given
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ password: 'hashed' } as any)
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      // When & Then
      await expect(authService.signin(signinData)).rejects.toThrow(BadRequestError)
    })
  })
})
