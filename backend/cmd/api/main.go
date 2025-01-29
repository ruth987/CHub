package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/ruth987/CHub.git/internal/delivery/http/handler"
	"github.com/ruth987/CHub.git/internal/repository/postgres"
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

	// Initialize usecases
	userUsecase := usecase.NewUserUsecase(userRepo, jwtService)

	// Initialize handlers
	userHandler := handler.NewUserHandler(userUsecase)

	// Setup router
	router := gin.Default()

	// User routes
	router.POST("/api/register", userHandler.Register)
	router.POST("/api/login", userHandler.Login)

	// Protected routes
	authorized := router.Group("/api")
	authorized.Use(authMiddleware(jwtService))
	{
		authorized.GET("/profile", userHandler.GetProfile)
	}

	router.Run(":8080")
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
