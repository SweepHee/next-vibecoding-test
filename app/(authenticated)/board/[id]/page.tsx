'use client'

import { useEffect, useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  authorId: number
  author: {
    name: string | null
    email: string
  }
  isAuthor?: boolean
}

export default function BoardViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/board/${id}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data)
        } else {
          toast.error('게시글을 찾을 수 없습니다.')
          router.push('/board')
        }
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다.', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id, router])

  async function onDelete() {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/board/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('게시글이 삭제되었습니다.')
        router.push('/board')
        router.refresh()
      } else {
        const result = await response.json()
        toast.error(result.message || '삭제 중 오류가 발생했습니다.')
      }
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다.')
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-10 px-4 text-center">로딩 중...</div>
  }

  if (!post) {
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                작성자: {post.author.name || post.author.email} | 작성일:{' '}
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-h-[300px] whitespace-pre-wrap py-6 border-y">
          {post.content}
        </CardContent>
        <CardFooter className="flex justify-between mt-4">
          <Link href="/board">
            <Button variant="outline">목록으로</Button>
          </Link>
          {post.isAuthor && (
            <div className="flex gap-2">
              <Link href={`/board/${id}/edit`}>
                <Button variant="secondary">수정</Button>
              </Link>
              <Button variant="destructive" onClick={onDelete}>
                삭제
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
