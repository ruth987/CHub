package postgres

import (
	"database/sql"
	"time"

	"github.com/ruth987/CHub.git/internal/domain"
)

type postRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) domain.PostRepository {
	return &postRepository{db: db}
}

func (r *postRepository) Create(post *domain.Post) error {
	query := `
        INSERT INTO posts (title, content, user_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`

	return r.db.QueryRow(
		query,
		post.Title,
		post.Content,
		post.UserID,
		post.CreatedAt,
		post.UpdatedAt,
	).Scan(&post.ID)
}

func (r *postRepository) GetByID(id uint) (*domain.Post, error) {
	post := &domain.Post{}
	query := `
        SELECT p.id, p.title, p.content, p.user_id, p.created_at, p.updated_at,
               u.username, u.email
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = $1`

	var user domain.User
	err := r.db.QueryRow(query, id).Scan(
		&post.ID,
		&post.Title,
		&post.Content,
		&post.UserID,
		&post.CreatedAt,
		&post.UpdatedAt,
		&user.Username,
		&user.Email,
	)
	if err != nil {
		return nil, err
	}

	user.ID = post.UserID
	post.User = &user
	return post, nil
}

func (r *postRepository) GetAll(page, limit int) ([]domain.Post, error) {
	offset := (page - 1) * limit
	query := `
        SELECT p.id, p.title, p.content, p.user_id, p.created_at, p.updated_at,
               u.username, u.email
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []domain.Post
	for rows.Next() {
		var post domain.Post
		var user domain.User
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			&post.UserID,
			&post.CreatedAt,
			&post.UpdatedAt,
			&user.Username,
			&user.Email,
		)
		if err != nil {
			return nil, err
		}
		user.ID = post.UserID
		post.User = &user
		posts = append(posts, post)
	}

	return posts, nil
}

func (r *postRepository) Update(post *domain.Post) error {
	query := `
        UPDATE posts 
        SET title = $1, content = $2, updated_at = $3
        WHERE id = $4 AND user_id = $5`

	result, err := r.db.Exec(
		query,
		post.Title,
		post.Content,
		time.Now(),
		post.ID,
		post.UserID,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (r *postRepository) Delete(id uint) error {
	query := `DELETE FROM posts WHERE id = $1`
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (r *postRepository) GetByUserID(userID uint) ([]domain.Post, error) {
	query := `
        SELECT id, title, content, user_id, created_at, updated_at
        FROM posts
        WHERE user_id = $1
        ORDER BY created_at DESC`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []domain.Post
	for rows.Next() {
		var post domain.Post
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			&post.UserID,
			&post.CreatedAt,
			&post.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	return posts, nil
}
