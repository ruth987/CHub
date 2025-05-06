package postgres

import (
	"database/sql"
	"log"

	"github.com/ruth987/CHub.git/internal/domain"
)

type savedPostRepository struct {
	db *sql.DB
}

func NewSavedPostRepository(db *sql.DB) domain.SavedPostRepository {
	return &savedPostRepository{db}
}

func (r *savedPostRepository) Create(savedPost *domain.SavedPost) error {
	query := `
        INSERT INTO saved_posts (user_id, post_id)
        VALUES ($1, $2)
        RETURNING id, created_at, updated_at
    `
	return r.db.QueryRow(
		query,
		savedPost.UserID,
		savedPost.PostID,
	).Scan(&savedPost.ID, &savedPost.CreatedAt, &savedPost.UpdatedAt)
}

func (r *savedPostRepository) Delete(userID, postID uint) error {
	query := `
        DELETE FROM saved_posts
        WHERE user_id = $1 AND post_id = $2
    `
	_, err := r.db.Exec(query, userID, postID)
	return err
}

func (r *savedPostRepository) GetByUserID(userID uint) ([]domain.SavedPost, error) {
	query := `
        SELECT 
            sp.id as saved_post_id,
            sp.user_id,
            sp.post_id,
            sp.created_at as saved_at,
            p.id, 
            p.title, 
            p.content, 
            p.image_url, 
            p.link_url,
            p.likes, 
            p.created_at, 
            p.updated_at,
            u.id as author_id, 
            u.username, 
            u.email, 
            COALESCE(u.bio, '') as bio,
            COALESCE(u.avatar_url, '') as avatar_url,
            COALESCE(u.post_count, 0) as post_count,
            u.created_at as user_created_at,
            u.updated_at as user_updated_at,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
        FROM saved_posts sp
        JOIN posts p ON sp.post_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE sp.user_id = $1
        ORDER BY sp.created_at DESC
    `

	rows, err := r.db.Query(query, userID)
	if err != nil {
		log.Printf("Query error: %v", err)
		return nil, err
	}
	defer rows.Close()

	var savedPosts []domain.SavedPost
	for rows.Next() {
		var sp domain.SavedPost
		sp.Post = &domain.Post{
			User: &domain.User{},
		}

		err := rows.Scan(
			&sp.ID,
			&sp.UserID,
			&sp.PostID,
			&sp.CreatedAt,
			&sp.Post.ID,
			&sp.Post.Title,
			&sp.Post.Content,
			&sp.Post.ImageURL,
			&sp.Post.LinkURL,
			&sp.Post.Likes,
			&sp.Post.CreatedAt,
			&sp.Post.UpdatedAt,
			&sp.Post.User.ID,
			&sp.Post.User.Username,
			&sp.Post.User.Email,
			&sp.Post.User.Bio,
			&sp.Post.User.AvatarURL,
			&sp.Post.User.PostCount,
			&sp.Post.User.CreatedAt,
			&sp.Post.User.UpdatedAt,
			&sp.Post.CommentCount,
		)
		if err != nil {
			log.Printf("Scan error: %v", err)
			return nil, err
		}

		sp.Post.IsSaved = true

		isLiked, err := r.IsLikedByUser(sp.Post.ID, userID)
		if err != nil {
			log.Printf("Error checking like status: %v", err)
			return nil, err
		}
		sp.Post.IsLiked = isLiked

		savedPosts = append(savedPosts, sp)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Rows error: %v", err)
		return nil, err
	}

	log.Printf("Found %d saved posts for user_id: %d", len(savedPosts), userID)
	return savedPosts, nil
}

func (r *savedPostRepository) IsLikedByUser(postID, userID uint) (bool, error) {
	var exists bool
	query := `
        SELECT EXISTS(
            SELECT 1 FROM post_likes 
            WHERE post_id = $1 AND user_id = $2
        )
    `
	err := r.db.QueryRow(query, postID, userID).Scan(&exists)
	return exists, err
}

func (r *savedPostRepository) IsSaved(userID, postID uint) (bool, error) {
	query := `
        SELECT EXISTS(
            SELECT 1 FROM saved_posts
            WHERE user_id = $1 AND post_id = $2
        )
    `
	var exists bool
	err := r.db.QueryRow(query, userID, postID).Scan(&exists)
	return exists, err
}
