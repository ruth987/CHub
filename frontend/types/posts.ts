export interface Post {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    linkUrl?: string;
    userId: number;
    likes: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreatePostRequest {
    title: string;
    content: string;
    imageUrl?: string;
    linkUrl?: string;
  }