package domain

import "time"

type SavedPost struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	PostID    uint      `json:"post_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Post      *Post     `json:"post,omitempty"`
	User      *User     `json:"user,omitempty"`
}

type SavedPostRepository interface {
	Create(savedPost *SavedPost) error
	Delete(userID, postID uint) error
	GetByUserID(userID uint) ([]SavedPost, error)
	IsSaved(userID, postID uint) (bool, error)
}

type SavedPostUsecase interface {
	SavePost(userID, postID uint) error
	UnsavePost(userID, postID uint) error
	GetSavedPosts(userID uint) ([]SavedPost, error)
	IsSaved(userID, postID uint) (bool, error)
}
