'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  author: {
    name: string | null
    email: string
  }
}

export default function BoardListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/board')
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다.', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">게시판</CardTitle>
          <Link href="/board/create">
            <Button>글쓰기</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">로딩 중...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              게시글이 없습니다. 첫 글을 작성해보세요!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-[150px]">작성자</TableHead>
                  <TableHead className="w-[150px]">작성일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.id}</TableCell>
                    <TableCell>
                      <Link
                        href={`/board/${post.id}`}
                        className="hover:underline font-medium"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>{post.author.name || post.author.email}</TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
