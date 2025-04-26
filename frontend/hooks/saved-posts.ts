import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { SavedPost } from '@/types/posts'

export function useSavedPosts() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  const { data: savedPosts = [], isLoading: isLoadingSavedPosts } = useQuery<SavedPost[]>({
    queryKey: ['saved-posts'],
    queryFn: async () => {
      const response = await api.get('/saved-posts', {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log("savedposts", response.data.saved_posts)
      return response.data.saved_posts
    },
    enabled: !!token
  })

  const { mutate: savePost } = useMutation({
    mutationFn: async (postId: number) => {
      const response = await api.post(`/saved-posts/${postId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] })
      // Optionally update the post immediately
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (oldData?.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((post: any) => 
                post.id === postId 
                  ? { ...post, is_saved: true }
                  : post
              )
            }))
          }
        }
        return oldData
      })
    },
  })

  const { mutate: unsavePost } = useMutation({
    mutationFn: async (postId: number) => {
      const response = await api.delete(`/saved-posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] })
      // Optionally update the post immediately
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (oldData?.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((post: any) => 
                post.id === postId 
                  ? { ...post, is_saved: false }
                  : post
              )
            }))
          }
        }
        return oldData
      })
    },
  })

  return {
    savedPosts,
    isLoadingSavedPosts,
    savePost,
    unsavePost,
  }
}