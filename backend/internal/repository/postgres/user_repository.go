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
        SELECT id, username, email, password, 
               COALESCE(bio, '') as bio,
               COALESCE(avatar_url, '') as avatar_url,
               COALESCE(post_count, 0) as post_count,
               created_at, updated_at 
        FROM users WHERE id = $1`

	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Bio,
		&user.AvatarURL,
		&user.PostCount,
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
        SELECT id, username, email, password, 
               COALESCE(bio, '') as bio,
               COALESCE(avatar_url, '') as avatar_url,
               COALESCE(post_count, 0) as post_count,
               created_at, updated_at 
        FROM users WHERE email = $1`

	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Bio,
		&user.AvatarURL,
		&user.PostCount,
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
        SELECT id, username, email, password, bio, avatar_url, post_count, created_at, updated_at 
        FROM users WHERE username = $1`

	err := r.db.QueryRow(query, username).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Bio,
		&user.AvatarURL,
		&user.PostCount,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	return user, err
}

func (r *userRepository) Update(user *domain.User) error {
	query := `
        UPDATE users 
        SET username = $1, email = $2, password = $3, bio = $4, avatar_url = $5, updated_at = $6
        WHERE id = $7`

	result, err := r.db.Exec(
		query,
		user.Username,
		user.Email,
		user.Password,
		user.Bio,
		user.AvatarURL,
		user.UpdatedAt,
		user.ID,
	)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New("user not found")
	}
	return nil
}

func (r *userRepository) GetUserPosts(userID uint, page, limit int) ([]domain.Post, error) {
	offset := (page - 1) * limit
	query := `
        SELECT id, title, content, image_url, link_url, user_id, likes, created_at, updated_at
        FROM posts
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3`

	rows, err := r.db.Query(query, userID, limit, offset)
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
			&post.ImageURL,
			&post.LinkURL,
			&post.UserID,
			&post.Likes,
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

func (r *userRepository) UpdatePostCount(userID uint) error {
	query := `
        UPDATE users 
        SET post_count = (SELECT COUNT(*) FROM posts WHERE user_id = $1)
        WHERE id = $1`

	_, err := r.db.Exec(query, userID)
	return err
}
