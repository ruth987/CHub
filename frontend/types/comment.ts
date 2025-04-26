import { User } from "./auth"

export interface Comment {
    id: number
    content: string
    user_id?: number
    post_id?: number
    parent_id?: number
    user: User
    replies?: Comment[]
    created_at: string
    updated_at: string
    likes: number
    reply_count: number
    is_liked: boolean
  }
  
  export interface CreateCommentRequest {
    content: string
    postId: number
    parentId?: number
  }
  
  export interface UpdateCommentRequest {
    content: string
  }