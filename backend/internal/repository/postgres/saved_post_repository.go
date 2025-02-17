package postgres

import (
    "database/sql"
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
            sp.id,
            sp.user_id,
            sp.post_id,
            sp.created_at,
            sp.updated_at,
            p.title,
            p.content,
            p.image_url,
            p.link_url,
            p.likes,
            p.comment_count,
            u.username,
            u.avatar_url
        FROM saved_posts sp
        JOIN posts p ON p.id = sp.post_id
        JOIN users u ON u.id = p.user_id
        WHERE sp.user_id = $1
        ORDER BY sp.created_at DESC
    `
    
    rows, err := r.db.Query(query, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var savedPosts []domain.SavedPost
    for rows.Next() {
        var sp domain.SavedPost
        var post domain.Post
        var user domain.User

        err := rows.Scan(
            &sp.ID,
            &sp.UserID,
            &sp.PostID,
            &sp.CreatedAt,
            &sp.UpdatedAt,
            &post.Title,
            &post.Content,
            &post.ImageURL,
            &post.LinkURL,
            &post.Likes,
            &post.CommentCount,
            &user.Username,
            &user.AvatarURL,
        )
        if err != nil {
            return nil, err
        }

        post.User = &user
        sp.Post = &post
        savedPosts = append(savedPosts, sp)
    }

    return savedPosts, nil
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