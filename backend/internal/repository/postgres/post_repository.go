package postgres

import (
	"database/sql"
	"errors"

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
        INSERT INTO posts (title, content, image_url, link_url, user_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`

	return r.db.QueryRow(
		query,
		post.Title,
		post.Content,
		post.ImageURL,
		post.LinkURL,
		post.User.ID,
		post.CreatedAt,
		post.UpdatedAt,
	).Scan(&post.ID)
}

func (r *postRepository) GetByID(id uint) (*domain.Post, error) {
	query := `
        SELECT 
            p.id, p.title, p.content, p.image_url, p.link_url, p.likes,
            p.created_at, p.updated_at,
            u.id, u.username, u.email, COALESCE(u.bio, '') as bio,
            COALESCE(u.avatar_url, '') as avatar_url,
            COALESCE(u.post_count, 0) as post_count,
            u.created_at, u.updated_at,
			(SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = $1`

	post := &domain.Post{
		User: &domain.User{},
	}

	err := r.db.QueryRow(query, id).Scan(
		&post.ID,
		&post.Title,
		&post.Content,
		&post.ImageURL,
		&post.LinkURL,
		&post.Likes,
		&post.CreatedAt,
		&post.UpdatedAt,
		&post.User.ID,
		&post.User.Username,
		&post.User.Email,
		&post.User.Bio,
		&post.User.AvatarURL,
		&post.User.PostCount,
		&post.User.CreatedAt,
		&post.User.UpdatedAt,
		&post.CommentCount,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("post not found")
	}
	if err != nil {
		return nil, err
	}

	return post, nil
}

func (r *postRepository) GetAll(page, limit int) ([]domain.Post, error) {
	offset := (page - 1) * limit
	query := `
        SELECT 
            p.id, p.title, p.content, p.image_url, p.link_url, p.likes,
            p.created_at, p.updated_at,
            u.id, u.username, u.email, COALESCE(u.bio, '') as bio,
            COALESCE(u.avatar_url, '') as avatar_url,
            COALESCE(u.post_count, 0) as post_count,
            u.created_at, u.updated_at,
			(SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
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
		post := domain.Post{
			User: &domain.User{},
		}
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			&post.ImageURL,
			&post.LinkURL,
			&post.Likes,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.User.ID,
			&post.User.Username,
			&post.User.Email,
			&post.User.Bio,
			&post.User.AvatarURL,
			&post.User.PostCount,
			&post.User.CreatedAt,
			&post.User.UpdatedAt,
			&post.CommentCount,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	return posts, nil
}

func (r *postRepository) GetByUserID(userID uint) ([]domain.Post, error) {
	query := `
        SELECT 
            p.id, p.title, p.content, p.image_url, p.link_url, p.likes,
            p.created_at, p.updated_at,
            u.id, u.username, u.email, COALESCE(u.bio, '') as bio,
            COALESCE(u.avatar_url, '') as avatar_url,
            COALESCE(u.post_count, 0) as post_count,
            u.created_at, u.updated_at
			(SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count

        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []domain.Post
	for rows.Next() {
		post := domain.Post{
			User: &domain.User{},
		}
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			&post.ImageURL,
			&post.LinkURL,
			&post.Likes,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.User.ID,
			&post.User.Username,
			&post.User.Email,
			&post.User.Bio,
			&post.User.AvatarURL,
			&post.User.PostCount,
			&post.User.CreatedAt,
			&post.User.UpdatedAt,
			&post.CommentCount,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	return posts, nil
}

func (r *postRepository) Update(post *domain.Post) error {
	query := `
        UPDATE posts 
        SET title = $1, content = $2, image_url = $3, link_url = $4, updated_at = $5
        WHERE id = $6 AND user_id = $7`

	result, err := r.db.Exec(
		query,
		post.Title,
		post.Content,
		post.ImageURL,
		post.LinkURL,
		post.UpdatedAt,
		post.ID,
		post.User.ID,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return errors.New("post not found or unauthorized")
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
		return errors.New("post not found")
	}

	return nil
}

func (r *postRepository) AddTags(postID uint, tags []string) error {
	// First, delete existing tags
	deleteQuery := `DELETE FROM post_tags WHERE post_id = $1`
	_, err := r.db.Exec(deleteQuery, postID)
	if err != nil {
		return err
	}

	// Insert new tags
	insertQuery := `INSERT INTO post_tags (post_id, tag) VALUES ($1, $2)`
	for _, tag := range tags {
		_, err := r.db.Exec(insertQuery, postID, tag)
		if err != nil {
			return err
		}
	}

	return nil
}

func (r *postRepository) GetTags(postID uint) ([]string, error) {
	query := `SELECT tag FROM post_tags WHERE post_id = $1`
	rows, err := r.db.Query(query, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []string
	for rows.Next() {
		var tag string
		if err := rows.Scan(&tag); err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}

	return tags, nil
}

func (r *postRepository) AddLike(postID, userID uint) error {
	query := `
        INSERT INTO post_likes (post_id, user_id, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (post_id, user_id) DO NOTHING`

	_, err := r.db.Exec(query, postID, userID)
	if err != nil {
		return err
	}

	// Update likes count in posts table
	updateQuery := `
        UPDATE posts 
        SET likes = (SELECT COUNT(*) FROM post_likes WHERE post_id = $1)
        WHERE id = $1`

	_, err = r.db.Exec(updateQuery, postID)
	return err
}

func (r *postRepository) RemoveLike(postID, userID uint) error {
	query := `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`
	_, err := r.db.Exec(query, postID, userID)
	if err != nil {
		return err
	}

	// Update likes count in posts table
	updateQuery := `
        UPDATE posts 
        SET likes = (SELECT COUNT(*) FROM post_likes WHERE post_id = $1)
        WHERE id = $1`

	_, err = r.db.Exec(updateQuery, postID)
	return err
}

func (r *postRepository) GetLikes(postID uint) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM post_likes WHERE post_id = $1`
	err := r.db.QueryRow(query, postID).Scan(&count)
	return count, err
}

func (r *postRepository) GetCommentCount(postID uint) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM comments WHERE post_id = $1`
	err := r.db.QueryRow(query, postID).Scan(&count)
	return count, err
}
