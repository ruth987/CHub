package usecase

import (
	"fmt"

	"github.com/ruth987/CHub.git/internal/domain"
)

type savedPostUsecase struct {
	savedPostRepo domain.SavedPostRepository
	postRepo      domain.PostRepository
}

func NewSavedPostUsecase(
	savedPostRepo domain.SavedPostRepository,
	postRepo domain.PostRepository,
) domain.SavedPostUsecase {
	return &savedPostUsecase{
		savedPostRepo: savedPostRepo,
		postRepo:      postRepo,
	}
}

func (u *savedPostUsecase) SavePost(userID, postID uint) error {
	// Check if post exists
	_, err := u.postRepo.GetByID(postID)
	if err != nil {
		return err
	}

	// Check if already saved
	isSaved, err := u.savedPostRepo.IsSaved(userID, postID)
	if err != nil {
		return err
	}
	if isSaved {
		return nil // Already saved, no error
	}

	savedPost := &domain.SavedPost{
		UserID: userID,
		PostID: postID,
	}
	return u.savedPostRepo.Create(savedPost)
}

func (u *savedPostUsecase) UnsavePost(userID, postID uint) error {
	return u.savedPostRepo.Delete(userID, postID)
}

func (u *savedPostUsecase) GetSavedPosts(userID uint) ([]domain.SavedPost, error) {
	fmt.Println("GetSavedPosts usecase")
	return u.savedPostRepo.GetByUserID(userID)
}

func (u *savedPostUsecase) IsSaved(userID, postID uint) (bool, error) {
	return u.savedPostRepo.IsSaved(userID, postID)
}
