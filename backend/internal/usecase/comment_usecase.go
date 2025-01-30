package usecase

import (
	"errors"
	"time"

	"github.com/ruth987/CHub.git/internal/domain"
)

type commentUsecase struct {
	commentRepo domain.CommentRepository
	postRepo    domain.PostRepository
}

func NewCommentUsecase(cr domain.CommentRepository, pr domain.PostRepository) domain.CommentUsecase {
	return &commentUsecase{
		commentRepo: cr,
		postRepo:    pr,
	}
}

func (u *commentUsecase) CreateComment(userID, postID uint, req *domain.CreateCommentRequest) (*domain.Comment, error) {
	// Verify post exists
	_, err := u.postRepo.GetByID(postID)
	if err != nil {
		return nil, errors.New("post not found")
	}

	// If it's a reply, verify parent comment exists
	if req.ParentID != nil {
		parentComment, err := u.commentRepo.GetByID(*req.ParentID)
		if err != nil {
			return nil, errors.New("parent comment not found")
		}
		if parentComment.PostID != postID {
			return nil, errors.New("parent comment does not belong to this post")
		}
	}

	now := time.Now()
	comment := &domain.Comment{
		Content:   req.Content,
		UserID:    userID,
		PostID:    postID,
		ParentID:  req.ParentID,
		CreatedAt: now,
		UpdatedAt: now,
	}

	err = u.commentRepo.Create(comment)
	if err != nil {
		return nil, err
	}

	return comment, nil
}

func (u *commentUsecase) GetPostComments(postID uint) ([]domain.Comment, error) {
	return u.commentRepo.GetByPostID(postID)
}

func (u *commentUsecase) UpdateComment(userID, commentID uint, content string) (*domain.Comment, error) {
	comment, err := u.commentRepo.GetByID(commentID)
	if err != nil {
		return nil, err
	}

	if comment.UserID != userID {
		return nil, errors.New("unauthorized to update this comment")
	}

	comment.Content = content
	comment.UpdatedAt = time.Now()

	err = u.commentRepo.Update(comment)
	if err != nil {
		return nil, err
	}

	return comment, nil
}

func (u *commentUsecase) DeleteComment(userID, commentID uint) error {
	comment, err := u.commentRepo.GetByID(commentID)
	if err != nil {
		return err
	}

	if comment.UserID != userID {
		return errors.New("unauthorized to delete this comment")
	}

	return u.commentRepo.Delete(commentID)
}
