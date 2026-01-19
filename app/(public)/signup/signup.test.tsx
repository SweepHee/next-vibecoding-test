import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SignUpPage from './page'
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

describe('SignUpPage Component', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any)
    
    // fetch 모킹
    global.fetch = vi.fn()
  })

  it('회원가입 폼이 정상적으로 렌더링되어야 함', () => {
    render(<SignUpPage />)
    
    expect(screen.getByLabelText('이름')).toBeInTheDocument()
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '계정 생성' })).toBeInTheDocument()
  })

  it('유효한 정보를 입력하고 제출하면 회원가입이 성공해야 함', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ message: '성공' }),
    } as any)

    render(<SignUpPage />)

    fireEvent.change(screen.getByLabelText('이름'), { target: { value: '테스터' } })
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), { target: { value: 'password123' } })
    
    fireEvent.click(screen.getByRole('button', { name: '계정 생성' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/signup', expect.any(Object))
      expect(toast.success).toHaveBeenCalledWith('회원가입이 완료되었습니다. 로그인해주세요.')
      expect(mockPush).toHaveBeenCalledWith('/signin')
    })
  })

  it('비밀번호가 일치하지 않으면 클라이언트 사이드 에러를 보여줘야 함', async () => {
    render(<SignUpPage />)

    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), { target: { value: 'wrongpassword' } })
    
    fireEvent.click(screen.getByRole('button', { name: '계정 생성' }))

    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument()
    })
  })
})
