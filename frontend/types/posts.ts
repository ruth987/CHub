import { User } from './auth'

export interface Post {
  id: number
  title: string
  content: string
  image_url?: string
  link_url?: string
  likes: number
  comment_count: number
  user: User
  tags: string[] 
  created_at: string
  updated_at: string
}

export interface CreatePostRequest {
  title: string
  content: string
  image_url?: string
  link_url?: string
  tags?: string[] | string 
}

export interface UpdatePostRequest {
  title?: string
  content?: string
  image_url?: string
  link_url?: string
  tags?: string[] | string 
}

export interface PostResponse {
  post: Post
  message?: string
}

export interface PostsResponse {
  posts: Post[]
  total_count?: number
  page?: number
  limit?: number
}

// For pagination
export interface PostsQueryParams {
  page?: number
  limit?: number
  user_id?: number
  tag?: string
}

// For likes
export interface LikeResponse {
  likes: number
  message?: string
}