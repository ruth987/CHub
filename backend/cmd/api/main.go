package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	httpDelivery "github.com/ruth987/CHub.git/internal/delivery/http"
	"github.com/ruth987/CHub.git/internal/delivery/http/handler"
	"github.com/ruth987/CHub.git/internal/repository/postgres"
	"github.com/ruth987/CHub.git/internal/services/s3"
	"github.com/ruth987/CHub.git/internal/usecase"
	"github.com/ruth987/CHub.git/pkg/auth"
	"github.com/ruth987/CHub.git/pkg/database"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database
	dbConfig := &database.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		DBName:   os.Getenv("DB_NAME"),
	}

	db, err := database.NewPostgresDB(dbConfig)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Initialize JWT service
	jwtService := auth.NewJWTService(os.Getenv("JWT_SECRET"))

	// Initialize repositories
	userRepo := postgres.NewUserRepository(db)
	postRepo := postgres.NewPostRepository(db)
	commentRepo := postgres.NewCommentRepository(db)
	savedPostRepo := postgres.NewSavedPostRepository(db)
	prayerRequestRepo := postgres.NewPrayerRequestRepository(db)

	// Initialize usecases
	userUsecase := usecase.NewUserUsecase(userRepo, jwtService)
	postUsecase := usecase.NewPostUsecase(postRepo, commentRepo)
	commentUsecase := usecase.NewCommentUsecase(commentRepo, postRepo)
	savedPostUsecase := usecase.NewSavedPostUsecase(savedPostRepo, postRepo)
	prayerRequestUsecase := usecase.NewPrayerRequestUsecase(prayerRequestRepo)

	// Initialize S3 service
	s3Service, err := s3.NewService()
	if err != nil {
		log.Fatalf("Failed to initialize S3 service: %v", err)
	}

	// Initialize handlers
	userHandler := handler.NewUserHandler(userUsecase, s3Service)
	postHandler := handler.NewPostHandler(postUsecase, s3Service)
	commentHandler := handler.NewCommentHandler(commentUsecase)
	savedPostHandler := handler.NewSavedPostHandler(savedPostUsecase)
	prayerRequestHandler := handler.NewPrayerRequestHandler(prayerRequestUsecase)

	// Initialize upload handler
	uploadHandler := handler.NewUploadHandler(s3Service)

	// Setup router
	router := httpDelivery.NewRouter(
		userHandler,
		postHandler,
		commentHandler,
		savedPostHandler,
		authMiddleware(jwtService),
		prayerRequestHandler,
	)

	// Add CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// File upload endpoint
	router.POST("/api/upload", uploadHandler.UploadFile)

	// Start the server
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func authMiddleware(jwtService *auth.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		tokenString := authHeader[7:]

		userID, err := jwtService.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("user_id", userID)
		c.Next()
	}
}
