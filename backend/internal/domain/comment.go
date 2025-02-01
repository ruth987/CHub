package domain

import "time"

type Comment struct {
    ID        uint      `json:"id"`
    Content   string    `json:"content"`
    UserID    uint      `json:"user_id"`
    PostID    uint      `json:"post_id"`
    ParentID  *uint     `json:"parent_id,omitempty"`
    User      *User     `json:"user,omitempty"`
    Replies   []Comment `json:"replies,omitempty"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type CreateCommentRequest struct {
    Content  string `json:"content" binding:"required"`
    ParentID *uint  `json:"parent_id,omitempty"`
}

type UpdateCommentRequest struct {
    Content string `json:"content" binding:"required"`
}

type CommentRepository interface {
    Create(comment *Comment) error
    GetByID(id uint) (*Comment, error)
    GetByPostID(postID uint, page, limit int) ([]Comment, error)
    Update(comment *Comment) error
    Delete(id uint) error
    GetReplies(commentID uint) ([]Comment, error)
}

type CommentUsecase interface {
    Create(userID, postID uint, req *CreateCommentRequest) (*Comment, error)
    GetByID(id uint) (*Comment, error)
    GetByPostID(postID uint, page, limit int) ([]Comment, error)
    Update(userID, commentID uint, req *UpdateCommentRequest) (*Comment, error)
    Delete(userID, commentID uint) error
}