import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '@/types/comment'
import { useState, useEffect } from 'react'

// Get all comments for a post
export function useComments(postId: string) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await api.get(`/posts/${postId}/comments`)
      return response.data
    },
  })
}

// Get a single comment
export function useComment(commentId: string) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return useQuery({
    queryKey: ['comments', commentId],
    queryFn: async () => {
      const response = await api.get(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    enabled: !!token
  })
}

// Create a comment
export function useCreateComment() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      const response = await api.post<Comment>(`/posts/${data.postId}/comments`, {
        content: data.content,
        parent_id: data.parentId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId.toString()] })
      toast.success('Comment posted successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to post comment'
      toast.error(message)
    },
  })
}

// Update a comment
export function useUpdateComment() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return useMutation({
    mutationFn: async ({ commentId, data }: { commentId: number; data: UpdateCommentRequest }) => {
      const response = await api.put<Comment>(`/comments/${commentId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      toast.success('Comment updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update comment')
    },
  })
}

// Delete a comment
export function useDeleteComment() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return useMutation({
    mutationFn: async (commentId: number) => {
      await api.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      toast.success('Comment deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete comment')
    },
  })
}

// Like a comment
export function useLikeComment() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return useMutation({
    mutationFn: async (commentId: number) => {
      await api.post(`/comments/${commentId}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      toast.success('Comment liked!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to like comment')
    },
  })
}

// Unlike a comment
export function useUnlikeComment() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return useMutation({
    mutationFn: async (commentId: number) => {
      await api.delete(`/comments/${commentId}/like`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      toast.success('Comment unliked!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to unlike comment')
    },
  })
}