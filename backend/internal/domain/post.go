package domain

import "time"

type Post struct {
	ID        uint      `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	UserID    uint      `json:"user_id"`
	User      *User     `json:"user,omitempty"`
	Comments  []Comment `json:"comments,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreatePostRequest struct {
	Title   string `json:"title" binding:"required,min=3,max=255"`
	Content string `json:"content" binding:"required"`
}

type PostRepository interface {
	Create(post *Post) error
	GetByID(id uint) (*Post, error)
	GetAll(page, limit int) ([]Post, error)
	GetByUserID(userID uint) ([]Post, error)
	Update(post *Post) error
	Delete(id uint) error
}

type PostUsecase interface {
	CreatePost(userID uint, req *CreatePostRequest) (*Post, error)
	GetPost(id uint) (*Post, error)
	GetAllPosts(page, limit int) ([]Post, error)
	GetUserPosts(userID uint) ([]Post, error)
	UpdatePost(userID uint, postID uint, req *CreatePostRequest) (*Post, error)
	DeletePost(userID uint, postID uint) error
}
