package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ruth987/CHub.git/internal/domain"
)

type PostHandler struct {
	postUsecase domain.PostUsecase
}

func NewPostHandler(pu domain.PostUsecase) *PostHandler {
	return &PostHandler{
		postUsecase: pu,
	}
}

// Create handles post creation
func (h *PostHandler) Create(c *gin.Context) {
	userID, exists := c.Get("user_id")
	fmt.Println(" in create post handler userID", userID)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req domain.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	post, err := h.postUsecase.Create(userID.(uint), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, post)
}

// GetByID handles getting a single post
func (h *PostHandler) GetByID(c *gin.Context) {
	// Get user ID from context (if authenticated)
	userID, exists := c.Get("user_id")
	var uid uint
	if exists {
		uid = userID.(uint)
	}

	// Parse post ID
	postID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	// Get post
	post, err := h.postUsecase.GetByID(uint(postID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// If user is authenticated, check interaction statuses
	if exists {
		// Check if post is liked by user
		isLiked, err := h.postUsecase.IsLikedByUser(uid, post.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		post.IsLiked = isLiked

		// Check if post is saved by user
		isSaved, err := h.postUsecase.IsSavedByUser(uid, post.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		post.IsSaved = isSaved

		// Check if post is reported by user
		isReported, err := h.postUsecase.IsReportedByUser(uid, post.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		post.IsReported = isReported
	}

	c.JSON(http.StatusOK, post)
}

// GetAll handles getting all posts with pagination
func (h *PostHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	var uid uint
	if userID, exists := c.Get("user_id"); exists {
		if id, ok := userID.(uint); ok {
			uid = id
		}
	}

	fmt.Println(" in post handler uid", uid)

	posts, err := h.postUsecase.GetAll(page, limit, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, posts)
}

// Update handles post updates
func (h *PostHandler) Update(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	postID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	var req domain.UpdatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	post, err := h.postUsecase.Update(userID.(uint), uint(postID), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, post)
}

// Delete handles post deletion
func (h *PostHandler) Delete(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	postID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	if err := h.postUsecase.Delete(userID.(uint), uint(postID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "post deleted successfully"})
}

// Like handles post liking
func (h *PostHandler) Like(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	postID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	if err := h.postUsecase.Like(userID.(uint), uint(postID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get updated post to return current like count and status
	post, err := h.postUsecase.GetByID(uint(postID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Set is_liked to true since we just liked it
	post.IsLiked = true

	c.JSON(http.StatusOK, gin.H{
		"message":  "post liked successfully",
		"likes":    post.Likes,
		"is_liked": true,
	})
}

// Unlike handles post unliking
func (h *PostHandler) Unlike(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	postID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	if err := h.postUsecase.Unlike(userID.(uint), uint(postID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get updated post to return current like count
	post, err := h.postUsecase.GetByID(uint(postID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Set is_liked to false since we just unliked it
	post.IsLiked = false

	c.JSON(http.StatusOK, gin.H{
		"message":  "post unliked successfully",
		"likes":    post.Likes,
		"is_liked": false,
	})
}
