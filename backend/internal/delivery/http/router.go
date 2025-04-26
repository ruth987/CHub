package http

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/ruth987/CHub.git/internal/delivery/http/handler"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("⚠️ Warning: Could not load .env file, using system environment variables.")
	}
}

func NewRouter(
	userHandler *handler.UserHandler,
	postHandler *handler.PostHandler,
	commentHandler *handler.CommentHandler,
	savedPostHandler *handler.SavedPostHandler,
	authMiddleware gin.HandlerFunc,
	prayerRequestHandler *handler.PrayerRequestHandler,

) *gin.Engine {
	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}))

	// Serve static files
	router.Static("/uploads", "./uploads")

	api := router.Group("/api")
	{
		// Public routes
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)

		// Prayer Request routes
		prayerRequests := api.Group("/prayer-requests")
		{
			prayerRequests.POST("", prayerRequestHandler.Create)
			prayerRequests.GET("/random", prayerRequestHandler.GetRandom)
			prayerRequests.GET("/:id", prayerRequestHandler.GetByID)
			prayerRequests.PUT("/:id", prayerRequestHandler.Update)
			prayerRequests.DELETE("/:id", prayerRequestHandler.Delete)
		}

		// Posts routes
		posts := api.Group("/posts")
		{
			// Protected post routes
			protected := posts.Use(authMiddleware)
			{
				posts.GET("", postHandler.GetAll)
				posts.GET("/:id", postHandler.GetByID)
				posts.GET("/:id/comments", commentHandler.GetByPostID)
				protected.POST("", postHandler.Create)
				protected.PUT("/:id", postHandler.Update)
				protected.DELETE("/:id", postHandler.Delete)
				protected.POST("/:id/like", postHandler.Like)
				protected.DELETE("/:id/like", postHandler.Unlike)
				protected.POST("/:id/comments", commentHandler.Create)
			}
		}

		// Protected routes
		protected := api.Group("")
		protected.Use(authMiddleware)
		{
			// User routes
			protected.GET("/profile", userHandler.GetProfile)
			protected.PUT("/profile", userHandler.UpdateProfile)
			protected.GET("/users/:id/posts", userHandler.GetUserPosts)

			// Comment routes
			comments := protected.Group("/comments")
			{
				comments.PUT("/:id", commentHandler.Update)
				comments.DELETE("/:id", commentHandler.Delete)
			}
		}

		// Saved post routes
		savedPosts := protected.Group("/saved-posts")
		{
			savedPosts.POST("/:id", savedPostHandler.SavePost)
			savedPosts.DELETE("/:id", savedPostHandler.UnsavePost)
			savedPosts.GET("", savedPostHandler.GetSavedPosts)
			savedPosts.GET("/:id/check", savedPostHandler.IsSaved)
		}
	}
	return router
}
