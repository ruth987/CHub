package usecase

import (
	"errors"
	"fmt"
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

func (u *postUsecase) Create(userID uint, req *domain.CreatePostRequest) (*domain.Post, error) {
	now := time.Now()
	post := &domain.Post{
		Title:     req.Title,
		Content:   req.Content,
		ImageURL:  req.ImageURL,
		LinkURL:   req.LinkURL,
		User:      &domain.User{ID: userID},
		CreatedAt: now,
		UpdatedAt: now,
	}

	err := u.postRepo.Create(post)
	if err != nil {
		return nil, err
	}

	// Add tags if provided
	if len(req.Tags) > 0 {
		err = u.postRepo.AddTags(post.ID, req.Tags)
		if err != nil {
			return nil, err
		}
		post.Tags = req.Tags
	}

	return post, nil
}

func (u *postUsecase) GetByID(id uint) (*domain.Post, error) {
	post, err := u.postRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Get tags
	tags, err := u.postRepo.GetTags(id)
	if err != nil {
		return nil, err
	}
	post.Tags = tags

	// Get likes count
	likes, err := u.postRepo.GetLikes(id)
	if err != nil {
		return nil, err
	}
	post.Likes = likes

	// Get comments
	comments, err := u.commentRepo.GetByPostID(id, 1, 100)
	if err != nil {
		return nil, err
	}
	post.Comments = comments

	return post, nil
}

func (u *postUsecase) GetAll(page, limit int, userID uint) ([]domain.Post, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	fmt.Println(" in post usecase userID", userID)

	posts, err := u.postRepo.GetAll(page, limit, userID)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func (u *postUsecase) GetByUserID(userID uint) ([]domain.Post, error) {
	return u.postRepo.GetByUserID(userID)
}

func (u *postUsecase) Update(userID uint, postID uint, req *domain.UpdatePostRequest) (*domain.Post, error) {
	post, err := u.postRepo.GetByID(postID)
	if err != nil {
		return nil, err
	}

	if post.User.ID != userID {
		return nil, errors.New("unauthorized to update this post")
	}

	if req.Title != "" {
		post.Title = req.Title
	}
	if req.Content != "" {
		post.Content = req.Content
	}
	if req.ImageURL != "" {
		post.ImageURL = req.ImageURL
	}
	if req.LinkURL != "" {
		post.LinkURL = req.LinkURL
	}
	post.UpdatedAt = time.Now()

	err = u.postRepo.Update(post)
	if err != nil {
		return nil, err
	}

	if len(req.Tags) > 0 {
		err = u.postRepo.AddTags(post.ID, req.Tags)
		if err != nil {
			return nil, err
		}
		post.Tags = req.Tags
	}

	return post, nil
}

func (u *postUsecase) Delete(userID uint, postID uint) error {
	post, err := u.postRepo.GetByID(postID)
	if err != nil {
		return err
	}

	if post.User.ID != userID {
		return errors.New("unauthorized to delete this post")
	}

	return u.postRepo.Delete(postID)
}

func (u *postUsecase) Like(userID uint, postID uint) error {
	return u.postRepo.AddLike(postID, userID)
}

func (u *postUsecase) Unlike(userID uint, postID uint) error {
	return u.postRepo.RemoveLike(postID, userID)
}

func (u *postUsecase) SavePost(userID, postID uint) error {
	return u.postRepo.AddSave(postID, userID)
}

func (u *postUsecase) UnsavePost(userID, postID uint) error {
	return u.postRepo.RemoveSave(postID, userID)
}

func (u *postUsecase) GetSavedPosts(userID uint) ([]domain.Post, error) {
	return u.postRepo.GetSavedPosts(userID)
}

func (u *postUsecase) Report(userID, postID uint) error {
	return u.postRepo.AddReport(postID, userID)
}

func (u *postUsecase) Unreport(userID, postID uint) error {
	return u.postRepo.RemoveReport(postID, userID)
}
func (u *postUsecase) IsLikedByUser(userID uint, postID uint) (bool, error) {
	return u.postRepo.IsLikedByUser(postID, userID)
}

func (u *postUsecase) IsSavedByUser(userID uint, postID uint) (bool, error) {
	return u.postRepo.IsSavedByUser(postID, userID)
}

func (u *postUsecase) IsReportedByUser(userID uint, postID uint) (bool, error) {
	return u.postRepo.IsReportedByUser(postID, userID)
}
