package postgres

import (
	"database/sql"

	"github.com/ruth987/CHub.git/internal/domain"
)

type commentRepository struct {
	db *sql.DB
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
	comment := &domain.Comment{}
	query := `
        SELECT c.id, c.content, c.user_id, c.post_id, c.parent_id, c.created_at, c.updated_at,
               u.username, u.email
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = $1`

	var user domain.User
	err := r.db.QueryRow(query, id).Scan(
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
	return comment, nil
}

func (r *commentRepository) GetByPostID(postID uint) ([]domain.Comment, error) {
	query := `
        SELECT c.id, c.content, c.user_id, c.post_id, c.parent_id, c.created_at, c.updated_at,
               u.username, u.email
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at ASC`

	rows, err := r.db.Query(query, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	comments := make([]domain.Comment, 0)
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
		comments = append(comments, comment)
	}

	return comments, nil
}

func (r *commentRepository) Update(comment *domain.Comment) error {
	query := `
        UPDATE comments 
        SET content = $1, updated_at = $2
        WHERE id = $3 AND user_id = $4`

	result, err := r.db.Exec(
		query,
		comment.Content,
		comment.UpdatedAt,
		comment.ID,
		comment.UserID,
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
		return sql.ErrNoRows
	}

	return nil
}
