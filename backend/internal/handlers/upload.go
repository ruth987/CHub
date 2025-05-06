package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ruth987/CHub.git/internal/services/s3"
)

type UploadHandler struct {
	s3Service *s3.Service
}

func NewUploadHandler(s3Service *s3.Service) *UploadHandler {
	return &UploadHandler{
		s3Service: s3Service,
	}
}

// UploadFile handles file uploads to S3
func (h *UploadHandler) UploadFile(c *gin.Context) {
	// Get the file from the request
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No file provided",
		})
		return
	}

	// Get the folder from the request (default to "uploads")
	folder := c.DefaultPostForm("folder", "uploads")

	// Upload the file to S3
	url, err := h.s3Service.UploadFile(c.Request.Context(), file, folder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to upload file",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"url": url,
	})
}
