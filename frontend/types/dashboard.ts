export interface Post {
    id: string
    title: string
    content: string
    author: {
      name: string
      image: string
    }
    createdAt: string
    tags: string[]
    likes: number
    comments: number
  }
  
  export interface Event {
    id: string
    title: string
    date: string
    attendees: number
  }
  
  export interface DailyVerse {
    verse: string
    reference: string
  }