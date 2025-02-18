package domain

import "time"

type Post struct {
	ID           uint      `json:"id"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	ImageURL     string    `json:"image_url,omitempty"`
	LinkURL      string    `json:"link_url,omitempty"`
	Likes        int       `json:"likes"`
	CommentCount int       `json:"comment_count"`
	User         *User     `json:"user,omitempty"`
	Tags         []string  `json:"tags,omitempty"`
	Comments     []Comment `json:"comments,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	IsLiked      bool      `json:"is_liked"`
	IsReported   bool      `json:"is_reported"`
	IsSaved      bool      `json:"is_saved"`
}

type CreatePostRequest struct {
	Title    string   `json:"title" binding:"required,min=3,max=255"`
	Content  string   `json:"content" binding:"required"`
	ImageURL string   `json:"image_url,omitempty"`
	LinkURL  string   `json:"link_url,omitempty"`
	Tags     []string `json:"tags,omitempty"`
}

type UpdatePostRequest struct {
	Title    string   `json:"title,omitempty" binding:"omitempty,min=3,max=255"`
	Content  string   `json:"content,omitempty"`
	ImageURL string   `json:"image_url,omitempty"`
	LinkURL  string   `json:"link_url,omitempty"`
	Tags     []string `json:"tags,omitempty"`
}

type PostRepository interface {
	Create(post *Post) error
	GetByID(id uint) (*Post, error)
	GetAll(page, limit int, userID uint) ([]Post, error)
	GetByUserID(userID uint) ([]Post, error)
	Update(post *Post) error
	Delete(id uint) error
	AddTags(postID uint, tags []string) error
	GetTags(postID uint) ([]string, error)
	AddLike(postID, userID uint) error
	RemoveLike(postID, userID uint) error
	GetLikes(postID uint) (int, error)
	GetCommentCount(postID uint) (int, error)
	AddSave(postID, userID uint) error
	RemoveSave(postID, userID uint) error
	IsSavedByUser(postID, userID uint) (bool, error)
	GetSavedPosts(userID uint) ([]Post, error)
	IsLikedByUser(postID, userID uint) (bool, error)
	AddReport(postID, userID uint) error
	RemoveReport(postID, userID uint) error
	IsReportedByUser(postID, userID uint) (bool, error)
}

type PostUsecase interface {
	Create(userID uint, req *CreatePostRequest) (*Post, error)
	GetByID(id uint) (*Post, error)
	GetAll(page, limit int, userID uint) ([]Post, error)
	GetByUserID(userID uint) ([]Post, error)
	Update(userID uint, postID uint, req *UpdatePostRequest) (*Post, error)
	Delete(userID uint, postID uint) error
	Like(userID uint, postID uint) error
	Unlike(userID uint, postID uint) error
	SavePost(userID, postID uint) error
	UnsavePost(userID, postID uint) error
	GetSavedPosts(userID uint) ([]Post, error)
	Report(userID, postID uint) error
	Unreport(userID, postID uint) error
	IsLikedByUser(userID uint, postID uint) (bool, error)
	IsSavedByUser(userID uint, postID uint) (bool, error)
	IsReportedByUser(userID uint, postID uint) (bool, error)
}
