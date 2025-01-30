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

	api := router.Group("/api")
	{
		// User routes
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)

		// Protected routes
		protected := api.Group("")
		protected.Use(authMiddleware)
		{
			// User routes
			protected.GET("/profile", userHandler.GetProfile)

			// Post routes
			protected.POST("/posts", postHandler.CreatePost)
			protected.PUT("/posts/:id", postHandler.UpdatePost)
			protected.DELETE("/posts/:id", postHandler.DeletePost)
		}

		// Public post routes
		api.GET("/posts", postHandler.GetAllPosts)
		api.GET("/users/:user_id/posts", postHandler.GetUserPosts)

		// Single post and its comments
		api.GET("/posts/:id", postHandler.GetPost)

		// Post comments
		api.GET("/posts/:id/comments", commentHandler.GetPostComments)
		protected.POST("/posts/:id/comments", commentHandler.CreateComment)

		// Comment management
		comments := protected.Group("/comments")
		{
			comments.PUT("/:id", commentHandler.UpdateComment)
			comments.DELETE("/:id", commentHandler.DeleteComment)
		}
	}

	return router
}
