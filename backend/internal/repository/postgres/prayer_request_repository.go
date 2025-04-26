package postgres

import (
	"context"
	"database/sql"
	"time"

	"github.com/ruth987/CHub.git/internal/domain"
)

type prayerRequestRepository struct {
	db *sql.DB
}

// NewPrayerRequestRepository creates a new instance of PrayerRequestRepository
func NewPrayerRequestRepository(db *sql.DB) domain.PrayerRequestRepository {
	return &prayerRequestRepository{
		db: db,
	}
}

func (r *prayerRequestRepository) Create(ctx context.Context, pr *domain.PrayerRequest) error {
	query := `
		INSERT INTO prayer_requests (content, created_at, updated_at)
		VALUES ($1, $2, $2)
		RETURNING id`

	now := time.Now()
	err := r.db.QueryRowContext(ctx, query, pr.Content, now).Scan(&pr.ID)
	if err != nil {
		return err
	}

	pr.CreatedAt = now
	pr.UpdatedAt = now
	return nil
}

func (r *prayerRequestRepository) GetByID(ctx context.Context, id uint) (*domain.PrayerRequest, error) {
	query := `
		SELECT id, content, created_at, updated_at
		FROM prayer_requests
		WHERE id = $1`

	pr := &domain.PrayerRequest{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&pr.ID,
		&pr.Content,
		&pr.CreatedAt,
		&pr.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, err
	}

	return pr, nil
}

func (r *prayerRequestRepository) GetRandom(ctx context.Context, limit int) ([]*domain.PrayerRequest, error) {
	query := `
		SELECT id, content, created_at, updated_at
		FROM prayer_requests
		ORDER BY RANDOM()
		LIMIT $1`

	rows, err := r.db.QueryContext(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var prayers []*domain.PrayerRequest
	for rows.Next() {
		pr := &domain.PrayerRequest{}
		err := rows.Scan(
			&pr.ID,
			&pr.Content,
			&pr.CreatedAt,
			&pr.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		prayers = append(prayers, pr)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return prayers, nil
}

func (r *prayerRequestRepository) Update(ctx context.Context, pr *domain.PrayerRequest) error {
	query := `
		UPDATE prayer_requests
		SET content = $1, updated_at = $2
		WHERE id = $3`

	now := time.Now()
	result, err := r.db.ExecContext(ctx, query, pr.Content, now, pr.ID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return domain.ErrNotFound
	}

	pr.UpdatedAt = now
	return nil
}

func (r *prayerRequestRepository) Delete(ctx context.Context, id uint) error {
	query := `DELETE FROM prayer_requests WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return domain.ErrNotFound
	}

	return nil
}
