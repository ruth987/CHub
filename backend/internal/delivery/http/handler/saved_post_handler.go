package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ruth987/CHub.git/internal/domain"
)

type SavedPostHandler struct {
	savedPostUsecase domain.SavedPostUsecase
}

func NewSavedPostHandler(savedPostUsecase domain.SavedPostUsecase) *SavedPostHandler {
	return &SavedPostHandler{
		savedPostUsecase: savedPostUsecase,
	}
}
func (h *SavedPostHandler) getUserIDFromContext(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}

func (h *SavedPostHandler) SavePost(c *gin.Context) {
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

	err = h.savedPostUsecase.SavePost(userID.(uint), uint(postID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "post saved successfully"})
}

func (h *SavedPostHandler) UnsavePost(c *gin.Context) {
	userID := h.getUserIDFromContext(c)
	postID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	err = h.savedPostUsecase.UnsavePost(uint(userID), uint(postID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post unsaved successfully"})
}

func (h *SavedPostHandler) GetSavedPosts(c *gin.Context) {
	fmt.Println("GetSavedPosts handler")
	userID := h.getUserIDFromContext(c)

	savedPosts, err := h.savedPostUsecase.GetSavedPosts(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"saved_posts": savedPosts})
}

func (h *SavedPostHandler) IsSaved(c *gin.Context) {
	userID := h.getUserIDFromContext(c)
	postID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	isSaved, err := h.savedPostUsecase.IsSaved(uint(userID), uint(postID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"is_saved": isSaved})
}
