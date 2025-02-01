package usecase

import (
	"errors"
	"fmt"
	"time"

	"github.com/ruth987/CHub.git/internal/domain"
	"github.com/ruth987/CHub.git/pkg/auth"
	"golang.org/x/crypto/bcrypt"
)

type userUsecase struct {
	userRepo   domain.UserRepository
	jwtService *auth.JWTService
}

func NewUserUsecase(userRepo domain.UserRepository, jwtService *auth.JWTService) domain.UserUsecase {
	return &userUsecase{
		userRepo:   userRepo,
		jwtService: jwtService,
	}
}

func (u *userUsecase) Register(req *domain.RegisterRequest) (*domain.User, error) {
	fmt.Printf("Registration attempt - Email: %s, Password length: %d\n",
		req.Email, len(req.Password))

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Password hashing failed: %v\n", err)
		return nil, err
	}

	fmt.Printf("Password successfully hashed, length: %d\n", len(hashedPassword))

	now := time.Now()
	user := &domain.User{
		Username:  req.Username,
		Email:     req.Email,
		Password:  string(hashedPassword),
		CreatedAt: now,
		UpdatedAt: now,
	}

	err = u.userRepo.Create(user)
	if err != nil {
		fmt.Printf("User creation failed: %v\n", err)
		return nil, err
	}

	fmt.Printf("User successfully registered with ID: %d\n", user.ID)

	// Don't return the password
	user.Password = ""
	return user, nil
}

func (u *userUsecase) Login(req *domain.LoginRequest) (*domain.LoginResponse, error) {
	fmt.Printf("Login attempt for email: %s with password: %s\n", req.Email, req.Password)

	user, err := u.userRepo.GetByEmail(req.Email)
	if err != nil {
		fmt.Printf("Error getting user by email: %v\n", err)
		return nil, errors.New("invalid email or password")
	}

	fmt.Printf("Comparing passwords:\nStored hash: %s\nProvided password: %s\n",
		user.Password, req.Password)

	// Compare passwords
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		fmt.Printf("Password comparison failed: %v\n", err)
		return nil, errors.New("invalid email or password")
	}

	// Generate JWT token
	token, err := u.jwtService.GenerateToken(user.ID)
	if err != nil {
		fmt.Printf("Token generation failed: %v\n", err)
		return nil, err
	}

	fmt.Printf("Login successful for user: %s\n", user.Email)

	// Don't return the password
	user.Password = ""
	return &domain.LoginResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (u *userUsecase) GetProfile(id uint) (*domain.User, error) {
	user, err := u.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Don't return the password
	user.Password = ""
	return user, nil
}

func (u *userUsecase) UpdateProfile(userID uint, req *domain.UpdateProfileRequest) (*domain.User, error) {
	user, err := u.userRepo.GetByID(userID)
	if err != nil {
		return nil, err
	}

	// Update only the fields that are provided
	if req.Bio != "" {
		user.Bio = req.Bio
	}
	if req.AvatarURL != "" {
		user.AvatarURL = req.AvatarURL
	}

	user.UpdatedAt = time.Now()

	err = u.userRepo.Update(user)
	if err != nil {
		return nil, err
	}

	// Don't return the password
	user.Password = ""
	return user, nil
}

func (u *userUsecase) GetUserPosts(userID uint, page, limit int) ([]domain.Post, error) {
	// Validate page and limit
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	return u.userRepo.GetUserPosts(userID, page, limit)
}
