import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SignInPage from './page'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// next/navigation 모킹
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

// sonner 모킹
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('SignInPage Component', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any)
    
    // fetch 모킹
    global.fetch = vi.fn()
  })

  it('로그인 폼이 정상적으로 렌더링되어야 함', () => {
    render(<SignInPage />)
    
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('유효한 정보를 입력하고 제출하면 로그인이 성공해야 함', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ message: '성공' }),
    } as any)

    render(<SignInPage />)

    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } })
    
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/signin', expect.any(Object))
      expect(toast.success).toHaveBeenCalledWith('로그인에 성공했습니다.')
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('API 호출 실패 시 에러 메시지를 표시해야 함', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ message: '로그인 실패' }),
    } as any)

    render(<SignInPage />)

    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } })
    
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(screen.getByText('로그인 실패')).toBeInTheDocument()
    })
  })
})
