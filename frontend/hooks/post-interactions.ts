import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

export function usePostInteractions() {
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token')

  const { mutate: likePost } = useMutation({
    mutationFn: async (postId: number) => {
      // Headers should be in the config object, not in the data
      const response = await api.post(`/posts/${postId}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    onSuccess: (data, postId) => {
      // Invalidate and update the specific post
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      // Optionally update the post immediately
      queryClient.setQueryData(['posts'], (oldData: any) => {
        // Update the post in the cache
        if (oldData?.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((post: any) => 
                post.id === postId 
                  ? { ...post, is_liked: true, likes: post.likes + 1 }
                  : post
              )
            }))
          }
        }
        return oldData
      })
    },
  })

  const { mutate: unlikePost } = useMutation({
    mutationFn: async (postId: number) => {
      const response = await api.delete(`/posts/${postId}/like`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      // Optionally update the post immediately
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (oldData?.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((post: any) => 
                post.id === postId 
                  ? { ...post, is_liked: false, likes: post.likes - 1 }
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
    likePost,
    unlikePost,
  }
}