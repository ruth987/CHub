package domain

import "time"

type Comment struct {
    ID        uint       `json:"id"`
    Content   string     `json:"content"`
    UserID    uint       `json:"user_id"`
    PostID    uint       `json:"post_id"`
    ParentID  *uint      `json:"parent_id,omitempty"`
    User      *User      `json:"user,omitempty"`
    Replies   []Comment  `json:"replies,omitempty"`
    CreatedAt time.Time  `json:"created_at"`
    UpdatedAt time.Time  `json:"updated_at"`
}

type CreateCommentRequest struct {
    Content  string `json:"content" binding:"required"`
    ParentID *uint  `json:"parent_id,omitempty"`
}

type CommentRepository interface {
    Create(comment *Comment) error
    GetByID(id uint) (*Comment, error)
    GetByPostID(postID uint) ([]Comment, error)
    Update(comment *Comment) error
    Delete(id uint) error
}

type CommentUsecase interface {
    CreateComment(userID, postID uint, req *CreateCommentRequest) (*Comment, error)
    GetPostComments(postID uint) ([]Comment, error)
    UpdateComment(userID, commentID uint, content string) (*Comment, error)
    DeleteComment(userID, commentID uint) error
}