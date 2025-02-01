package http

import (
	"github.com/gin-gonic/gin"
	"github.com/ruth987/CHub.git/internal/delivery/http/handler"
)

func NewRouter(
	userHandler *handler.UserHandler,
	postHandler *handler.PostHandler,
	commentHandler *handler.CommentHandler,
	authMiddleware gin.HandlerFunc,
) *gin.Engine {
	router := gin.Default()

	// Serve static files
	router.Static("/uploads", "./uploads")

	api := router.Group("/api")
	{
		// Public routes
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)

		// Posts routes
		posts := api.Group("/posts")
		{
			// Public post routes
			posts.GET("", postHandler.GetAll)
			posts.GET("/:id", postHandler.GetByID)
			posts.GET("/:id/comments", commentHandler.GetByPostID)

			// Protected post routes
			protected := posts.Use(authMiddleware)
			{
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
			protected.GET("/users/:user_id/posts", userHandler.GetUserPosts)

			// Comment routes
			comments := protected.Group("/comments")
			{
				comments.PUT("/:id", commentHandler.Update)
				comments.DELETE("/:id", commentHandler.Delete)
			}
		}
	}

	return router
}
