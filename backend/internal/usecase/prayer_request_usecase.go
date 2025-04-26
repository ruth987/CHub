package usecase

import (
	"context"
	"errors"

	"github.com/ruth987/CHub.git/internal/domain"
)

type prayerRequestUsecase struct {
	prayerRequestRepo domain.PrayerRequestRepository
}

// NewPrayerRequestUsecase creates a new instance of PrayerRequestUsecase
func NewPrayerRequestUsecase(repo domain.PrayerRequestRepository) domain.PrayerRequestUsecase {
	return &prayerRequestUsecase{
		prayerRequestRepo: repo,
	}
}

func (u *prayerRequestUsecase) Create(ctx context.Context, pr *domain.PrayerRequest) error {
	if pr.Content == "" {
		return errors.New("prayer request content cannot be empty")
	}

	return u.prayerRequestRepo.Create(ctx, pr)
}

func (u *prayerRequestUsecase) GetByID(ctx context.Context, id uint) (*domain.PrayerRequest, error) {
	return u.prayerRequestRepo.GetByID(ctx, id)
}

func (u *prayerRequestUsecase) GetRandomPrayers(ctx context.Context, limit int) ([]*domain.PrayerRequest, error) {
	if limit <= 0 {
		limit = 3 // Default to 3 random prayers if limit is not specified or invalid
	}
	return u.prayerRequestRepo.GetRandom(ctx, limit)
}

func (u *prayerRequestUsecase) Update(ctx context.Context, pr *domain.PrayerRequest) error {
	if pr.Content == "" {
		return errors.New("prayer request content cannot be empty")
	}

	return u.prayerRequestRepo.Update(ctx, pr)
}

func (u *prayerRequestUsecase) Delete(ctx context.Context, id uint) error {
	return u.prayerRequestRepo.Delete(ctx, id)
}
