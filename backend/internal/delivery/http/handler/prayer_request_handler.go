package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ruth987/CHub.git/internal/domain"
)

type PrayerRequestHandler struct {
	prayerRequestUsecase domain.PrayerRequestUsecase
}

func NewPrayerRequestHandler(usecase domain.PrayerRequestUsecase) *PrayerRequestHandler {
	return &PrayerRequestHandler{
		prayerRequestUsecase: usecase,
	}
}

type createPrayerRequestRequest struct {
	Content string `json:"content" binding:"required"`
}

func (h *PrayerRequestHandler) Create(c *gin.Context) {
	var req createPrayerRequestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prayerRequest := &domain.PrayerRequest{
		Content: req.Content,
	}

	err := h.prayerRequestUsecase.Create(c.Request.Context(), prayerRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, prayerRequest)
}

func (h *PrayerRequestHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	prayerRequest, err := h.prayerRequestUsecase.GetByID(c.Request.Context(), uint(id))
	if err == domain.ErrNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "prayer request not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, prayerRequest)
}

func (h *PrayerRequestHandler) GetRandom(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "3")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 3
	}

	prayers, err := h.prayerRequestUsecase.GetRandomPrayers(c.Request.Context(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"prayer_requests": prayers})
}

func (h *PrayerRequestHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req createPrayerRequestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prayerRequest := &domain.PrayerRequest{
		ID:      uint(id),
		Content: req.Content,
	}

	err = h.prayerRequestUsecase.Update(c.Request.Context(), prayerRequest)
	if err == domain.ErrNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "prayer request not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, prayerRequest)
}

func (h *PrayerRequestHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	err = h.prayerRequestUsecase.Delete(c.Request.Context(), uint(id))
	if err == domain.ErrNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "prayer request not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
