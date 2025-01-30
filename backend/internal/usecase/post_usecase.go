package usecase

import (
	"errors"
	"time"

	"github.com/ruth987/CHub.git/internal/domain"
)

type postUsecase struct {
	postRepo    domain.PostRepository
	commentRepo domain.CommentRepository
}

func NewPostUsecase(pr domain.PostRepository, cr domain.CommentRepository) domain.PostUsecase {
	return &postUsecase{
		postRepo:    pr,
		commentRepo: cr,
	}
}

func (u *postUsecase) CreatePost(userID uint, req *domain.CreatePostRequest) (*domain.Post, error) {
	now := time.Now()
	post := &domain.Post{
		Title:     req.Title,
		Content:   req.Content,
		UserID:    userID,
		CreatedAt: now,
		UpdatedAt: now,
	}

	err := u.postRepo.Create(post)
	if err != nil {
		return nil, err
	}

	return post, nil
}

func (u *postUsecase) GetPost(id uint) (*domain.Post, error) {
	post, err := u.postRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Get comments for the post
	comments, err := u.commentRepo.GetByPostID(id)
	if err != nil {
		return nil, err
	}

	// Organize comments into a tree structure
	commentMap := make(map[uint][]domain.Comment)
	var rootComments []domain.Comment

	for _, comment := range comments {
		if comment.ParentID == nil {
			rootComments = append(rootComments, comment)
		} else {
			parentID := *comment.ParentID
			commentMap[parentID] = append(commentMap[parentID], comment)
		}
	}

	// Recursively attach replies
	for i := range rootComments {
		attachReplies(&rootComments[i], commentMap)
	}

	post.Comments = rootComments
	return post, nil
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

func (u *postUsecase) GetAllPosts(page, limit int) ([]domain.Post, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	return u.postRepo.GetAll(page, limit)
}

func (u *postUsecase) GetUserPosts(userID uint) ([]domain.Post, error) {
	return u.postRepo.GetByUserID(userID)
}

func (u *postUsecase) UpdatePost(userID uint, postID uint, req *domain.CreatePostRequest) (*domain.Post, error) {
	post, err := u.postRepo.GetByID(postID)
	if err != nil {
		return nil, err
	}

	if post.UserID != userID {
		return nil, errors.New("unauthorized to update this post")
	}

	post.Title = req.Title
	post.Content = req.Content
	post.UpdatedAt = time.Now()

	err = u.postRepo.Update(post)
	if err != nil {
		return nil, err
	}

	return post, nil
}

func (u *postUsecase) DeletePost(userID uint, postID uint) error {
	post, err := u.postRepo.GetByID(postID)
	if err != nil {
		return err
	}

	if post.UserID != userID {
		return errors.New("unauthorized to delete this post")
	}

	return u.postRepo.Delete(postID)
}
