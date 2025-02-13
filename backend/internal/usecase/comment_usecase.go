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

func (u *commentUsecase) Create(userID, postID uint, req *domain.CreateCommentRequest) (*domain.Comment, error) {
	// Verify post exists
	_, err := u.postRepo.GetByID(postID)
	if err != nil {
		return nil, errors.New("post not found")
	}

	// If it's a reply, verify parent comment exists and belongs to the same post
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

	// Fetch the complete comment with user information
	return u.commentRepo.GetByID(comment.ID)
}

func (u *commentUsecase) GetByID(id uint) (*domain.Comment, error) {
	comment, err := u.commentRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Get replies if any
	replies, err := u.commentRepo.GetReplies(comment.ID)
	if err != nil {
		return nil, err
	}
	comment.Replies = replies

	return comment, nil
}

func (u *commentUsecase) GetByPostID(postID uint, page, limit int) ([]domain.Comment, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	comments, err := u.commentRepo.GetByPostID(postID, page, limit)
	if err != nil {
		return nil, err
	}

	// Organize comments into a tree structure
	var rootComments []domain.Comment
	commentMap := make(map[uint][]domain.Comment)

	for _, comment := range comments {
		if comment.ParentID == nil {
			rootComments = append(rootComments, comment)
		} else {
			parentID := *comment.ParentID
			commentMap[parentID] = append(commentMap[parentID], comment)
		}
	}

	// Attach replies to their parent comments
	for i := range rootComments {
		attachReplies(&rootComments[i], commentMap)
	}

	return rootComments, nil
}

func attachReplies(comment *domain.Comment, commentMap map[uint][]domain.Comment) {
	replies := commentMap[comment.ID]
	if len(replies) > 0 {
		comment.Replies = replies
		for i := range comment.Replies {
			attachReplies(&comment.Replies[i], commentMap)
		}
	}
}

func (u *commentUsecase) Update(userID, commentID uint, req *domain.UpdateCommentRequest) (*domain.Comment, error) {
	comment, err := u.commentRepo.GetByID(commentID)
	if err != nil {
		return nil, err
	}

	if comment.UserID != userID {
		return nil, errors.New("unauthorized to update this comment")
	}

	comment.Content = req.Content
	comment.UpdatedAt = time.Now()

	err = u.commentRepo.Update(comment)
	if err != nil {
		return nil, err
	}

	return comment, nil
}

func (u *commentUsecase) Delete(userID, commentID uint) error {
	comment, err := u.commentRepo.GetByID(commentID)
	if err != nil {
		return err
	}

	if comment.UserID != userID {
		return errors.New("unauthorized to delete this comment")
	}

	return u.commentRepo.Delete(commentID)
}

func (u *commentUsecase) Like(userID, commentID uint) error {
	// Verify comment exists
	_, err := u.commentRepo.GetByID(commentID)
	if err != nil {
		return err
	}
	return u.commentRepo.AddLike(commentID, userID)
}

func (u *commentUsecase) Unlike(userID, commentID uint) error {
	// Verify comment exists
	_, err := u.commentRepo.GetByID(commentID)
	if err != nil {
		return err
	}
	return u.commentRepo.RemoveLike(commentID, userID)
}
