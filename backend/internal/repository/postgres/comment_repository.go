package postgres

import (
	"database/sql"
	"errors"

	"github.com/ruth987/CHub.git/internal/domain"
)

type commentRepository struct {
	db *sql.DB
}

func (r *commentRepository) AddReport(commentID, userID uint) error {
	query := `
        INSERT INTO comment_reports (comment_id, user_id, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (comment_id, user_id) DO NOTHING
    `
	_, err := r.db.Exec(query, commentID, userID)
	return err
}

func (r *commentRepository) GetReplyCount(commentID uint) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM comments WHERE parent_id = $1`
	err := r.db.QueryRow(query, commentID).Scan(&count)
	return count, err
}

func (r *commentRepository) IsLikedByUser(commentID, userID uint) (bool, error) {
	query := `
        SELECT EXISTS(
            SELECT 1 FROM comment_likes
            WHERE comment_id = $1 AND user_id = $2
        )
    `
	var exists bool
	err := r.db.QueryRow(query, commentID, userID).Scan(&exists)
	return exists, err
}

func (r *commentRepository) RemoveReport(commentID, userID uint) error {
	query := `DELETE FROM comment_reports WHERE comment_id = $1 AND user_id = $2`
	_, err := r.db.Exec(query, commentID, userID)
	return err
}

func (r *commentRepository) IsReportedByUser(commentID, userID uint) (bool, error) {
	query := `
        SELECT EXISTS(
            SELECT 1 FROM comment_reports
            WHERE comment_id = $1 AND user_id = $2
        )
    `
	var exists bool
	err := r.db.QueryRow(query, commentID, userID).Scan(&exists)
	return exists, err
}

func NewCommentRepository(db *sql.DB) domain.CommentRepository {
	return &commentRepository{db: db}
}

func (r *commentRepository) Create(comment *domain.Comment) error {
	query := `
        INSERT INTO comments (content, user_id, post_id, parent_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`

	return r.db.QueryRow(
		query,
		comment.Content,
		comment.UserID,
		comment.PostID,
		comment.ParentID,
		comment.CreatedAt,
		comment.UpdatedAt,
	).Scan(&comment.ID)
}

func (r *commentRepository) GetByID(id uint) (*domain.Comment, error) {
	query := `
        SELECT 
            c.id, c.content, c.user_id, c.post_id, c.parent_id, 
            c.created_at, c.updated_at,
            u.id as user_id,
            u.username, 
            u.email, 
            COALESCE(u.bio, '') as bio,
            COALESCE(u.avatar_url, '') as avatar_url,
            COALESCE(u.post_count, 0) as post_count,
            u.created_at as user_created_at,
            u.updated_at as user_updated_at,
            (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes,
            COALESCE((SELECT COUNT(*) FROM comments WHERE parent_id = c.id), 0) as reply_count
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = $1`

	comment := &domain.Comment{
		User: &domain.User{},
	}

	err := r.db.QueryRow(query, id).Scan(
		&comment.ID,
		&comment.Content,
		&comment.UserID,
		&comment.PostID,
		&comment.ParentID,
		&comment.CreatedAt,
		&comment.UpdatedAt,
		&comment.User.ID,
		&comment.User.Username,
		&comment.User.Email,
		&comment.User.Bio,
		&comment.User.AvatarURL,
		&comment.User.PostCount,
		&comment.User.CreatedAt,
		&comment.User.UpdatedAt,
		&comment.Likes,
		&comment.ReplyCount,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("comment not found")
	}
	if err != nil {
		return nil, err
	}

	return comment, nil
}

func (r *commentRepository) GetByPostID(postID uint, page, limit int) ([]domain.Comment, error) {
	offset := (page - 1) * limit
	query := `
       SELECT 
            c.id, c.content, c.user_id, c.post_id, c.parent_id, 
            c.created_at, c.updated_at,
            u.id as user_id,
            u.username, 
            u.email, 
            COALESCE(u.bio, '') as bio,
            COALESCE(u.avatar_url, '') as avatar_url,
            COALESCE(u.post_count, 0) as post_count,
            u.created_at as user_created_at,
            u.updated_at as user_updated_at,
            (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes,
            COALESCE((SELECT COUNT(*) FROM comments WHERE parent_id = c.id), 0) as reply_count
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3`

	rows, err := r.db.Query(query, postID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []domain.Comment
	for rows.Next() {
		var comment domain.Comment
		comment.User = &domain.User{}
		err := rows.Scan(
			&comment.ID,
			&comment.Content,
			&comment.UserID,
			&comment.PostID,
			&comment.ParentID,
			&comment.CreatedAt,
			&comment.UpdatedAt,
			&comment.User.ID,
			&comment.User.Username,
			&comment.User.Email,
			&comment.User.Bio,
			&comment.User.AvatarURL,
			&comment.User.PostCount,
			&comment.User.CreatedAt,
			&comment.User.UpdatedAt,
			&comment.Likes,
			&comment.ReplyCount,
		)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, nil
}

func (r *commentRepository) GetReplies(commentID uint) ([]domain.Comment, error) {
	query := `
        SELECT c.id, c.content, c.user_id, c.post_id, c.parent_id, c.created_at, c.updated_at,
               u.username, u.email
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.parent_id = $1
        ORDER BY c.created_at ASC`

	rows, err := r.db.Query(query, commentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var replies []domain.Comment
	for rows.Next() {
		var comment domain.Comment
		var user domain.User
		err := rows.Scan(
			&comment.ID,
			&comment.Content,
			&comment.UserID,
			&comment.PostID,
			&comment.ParentID,
			&comment.CreatedAt,
			&comment.UpdatedAt,
			&user.Username,
			&user.Email,
		)
		if err != nil {
			return nil, err
		}
		user.ID = comment.UserID
		comment.User = &user
		replies = append(replies, comment)
	}

	return replies, nil
}

func (r *commentRepository) Update(comment *domain.Comment) error {
	query := `
        UPDATE comments 
        SET content = $1, updated_at = $2
        WHERE id = $3 AND user_id = $4`

	result, err := r.db.Exec(query, comment.Content, comment.UpdatedAt, comment.ID, comment.UserID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return errors.New("comment not found or unauthorized")
	}

	return nil
}

func (r *commentRepository) Delete(id uint) error {
	query := `DELETE FROM comments WHERE id = $1`
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return errors.New("comment not found")
	}

	return nil
}
func (r *commentRepository) AddLike(commentID, userID uint) error {
	query := `
        INSERT INTO comment_likes (comment_id, user_id, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (comment_id, user_id) DO NOTHING`

	_, err := r.db.Exec(query, commentID, userID)
	if err != nil {
		return err
	}

	// Update likes count
	updateQuery := `
        UPDATE comments 
        SET likes = (SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1)
        WHERE id = $1`

	_, err = r.db.Exec(updateQuery, commentID)
	return err
}

func (r *commentRepository) RemoveLike(commentID, userID uint) error {
	query := `DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2`
	_, err := r.db.Exec(query, commentID, userID)
	if err != nil {
		return err
	}

	// Update likes count
	updateQuery := `
        UPDATE comments 
        SET likes = (SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1)
        WHERE id = $1`

	_, err = r.db.Exec(updateQuery, commentID)
	return err
}

func (r *commentRepository) GetLikes(commentID uint) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1`
	err := r.db.QueryRow(query, commentID).Scan(&count)
	return count, err
}
