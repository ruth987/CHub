import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Post, CreatePostRequest, UpdatePostRequest } from '@/types/posts'

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get(`/posts`)
      console.log(response.data)
      return response.data
    },
  })
}

export function usePost(postId: string) {
    return useQuery({
      queryKey: ['posts', postId],
      queryFn: async () => {
        const response = await api.get(`/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log(response.data)
        return response.data
      },
    })
  }

export function useUserPosts(userId: number | undefined) {
    return useQuery<Post[]>({
      queryKey: ['posts', 'user', userId],
      queryFn: async () => {
        const response = await api.get(`/users/${userId}/posts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
      },
      enabled: !!userId,
    })
  }

  export function useCreatePost() {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: async (data: CreatePostRequest) => {
        const response = await api.post<Post>('/posts', {
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : data.tags?.split(',').map(tag => tag.trim())
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
        queryClient.invalidateQueries({ queryKey: ['posts', 'user'] })
        toast.success('Post created successfully!')
      },
      onError: (error: any) => {
        const message = error.response?.data?.error || 'Failed to create post'
        toast.error(message)
        throw error 
      },
    })
  }

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, data }: { postId: number; data: UpdatePostRequest }) => {
      const response = await api.put<Post>(`/posts/${postId}`, {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : data.tags?.split(',').map(tag => tag.trim())
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update post')
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: number) => {
      await api.delete(`/posts/${postId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete post')
    },
  })
}