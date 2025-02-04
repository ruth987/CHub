export interface User {
    id: number;
    username: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    postCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }