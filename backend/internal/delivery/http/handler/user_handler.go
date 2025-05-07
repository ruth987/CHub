package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ruth987/CHub.git/internal/domain"
	"github.com/ruth987/CHub.git/internal/services/s3"
)

type UserHandler struct {
	userUsecase domain.UserUsecase
	s3Service   *s3.Service
}

func NewUserHandler(userUsecase domain.UserUsecase, s3Service *s3.Service) *UserHandler {
	return &UserHandler{
		userUsecase: userUsecase,
		s3Service:   s3Service,
	}
}

func (h *UserHandler) Register(c *gin.Context) {
	var req domain.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userUsecase.Register(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Log signup activity to S3
	details := fmt.Sprintf("New user registered with email: %s", req.Email)
	_, err = h.s3Service.LogUserActivity(c.Request.Context(), user.Username, "signup", details)
	if err != nil {
		fmt.Printf("Failed to log signup activity to S3: %v\n", err)
	}

	c.JSON(http.StatusCreated, user)
}

func (h *UserHandler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("Login attempt for email: %s\n", req.Email)

	response, err := h.userUsecase.Login(&req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Log login activity to S3
	details := fmt.Sprintf("User logged in with email: %s", req.Email)
	_, err = h.s3Service.LogUserActivity(c.Request.Context(), response.User.Username, "login", details)
	if err != nil {
		fmt.Printf("Failed to log login activity to S3: %v\n", err)
	}

	c.JSON(http.StatusOK, response)
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")
	user, err := h.userUsecase.GetProfile(userID.(uint))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req domain.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userUsecase.UpdateProfile(userID.(uint), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}
func (h *UserHandler) GetUserPosts(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	page := 1
	limit := 10

	pageStr := c.DefaultQuery("page", "1")
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}

	// Get limit from query parameters
	limitStr := c.DefaultQuery("limit", "10")
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	posts, err := h.userUsecase.GetUserPosts(uint(userID), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, posts)
}
