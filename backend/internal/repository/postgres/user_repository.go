package postgres

import (
	"database/sql"
	"errors"

	"github.com/ruth987/CHub.git/internal/domain"
)

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) domain.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *domain.User) error {
	query := `
        INSERT INTO users (username, email, password, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`

	return r.db.QueryRow(
		query,
		user.Username,
		user.Email,
		user.Password,
		user.CreatedAt,
		user.UpdatedAt,
	).Scan(&user.ID)
}

func (r *userRepository) GetByID(id uint) (*domain.User, error) {
	user := &domain.User{}
	query := `
        SELECT id, username, email, password, created_at, updated_at 
        FROM users WHERE id = $1`

	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *userRepository) GetByEmail(email string) (*domain.User, error) {
	user := &domain.User{}
	query := `
        SELECT id, username, email, password, created_at, updated_at 
        FROM users WHERE email = $1`

	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *userRepository) GetByUsername(username string) (*domain.User, error) {
	user := &domain.User{}
	query := `
        SELECT id, username, email, password, created_at, updated_at 
        FROM users WHERE username = $1`

	err := r.db.QueryRow(query, username).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *userRepository) Update(user *domain.User) error {
	query := `
        UPDATE users 
        SET username = $1, email = $2, password = $3, updated_at = $4
        WHERE id = $5`

	result, err := r.db.Exec(
		query,
		user.Username,
		user.Email,
		user.Password,
		user.UpdatedAt,
		user.ID,
	)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}

func (r *userRepository) Delete(id uint) error {
	query := `DELETE FROM users WHERE id = $1`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}
