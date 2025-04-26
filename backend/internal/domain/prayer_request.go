package domain

import (
	"context"
	"errors"
	"time"
)

// Error definitions
var (
	ErrNotFound = errors.New("not found")
)

// PrayerRequest represents the prayer request entity
type PrayerRequest struct {
	ID        uint      `json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// PrayerRequestRepository represents the prayer request repository contract
type PrayerRequestRepository interface {
	Create(ctx context.Context, prayerRequest *PrayerRequest) error
	GetByID(ctx context.Context, id uint) (*PrayerRequest, error)
	GetRandom(ctx context.Context, limit int) ([]*PrayerRequest, error)
	Update(ctx context.Context, prayerRequest *PrayerRequest) error
	Delete(ctx context.Context, id uint) error
}

// PrayerRequestUsecase represents the prayer request usecase contract
type PrayerRequestUsecase interface {
	Create(ctx context.Context, prayerRequest *PrayerRequest) error
	GetByID(ctx context.Context, id uint) (*PrayerRequest, error)
	GetRandomPrayers(ctx context.Context, limit int) ([]*PrayerRequest, error)
	Update(ctx context.Context, prayerRequest *PrayerRequest) error
	Delete(ctx context.Context, id uint) error
}
