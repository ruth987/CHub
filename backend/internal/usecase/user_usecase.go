package usecase

import (
	"errors"
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
	// Check if email already exists
	existingUser, err := u.userRepo.GetByEmail(req.Email)
	if err == nil && existingUser != nil {
		return nil, errors.New("email already registered")
	}

	// Check if username already exists
	existingUser, err = u.userRepo.GetByUsername(req.Username)
	if err == nil && existingUser != nil {
		return nil, errors.New("username already taken")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

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
		return nil, err
	}

	// Don't return the password
	user.Password = ""
	return user, nil
}

func (u *userUsecase) Login(req *domain.LoginRequest) (*domain.LoginResponse, error) {
	user, err := u.userRepo.GetByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Compare passwords
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Generate JWT token
	token, err := u.jwtService.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

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

func (u *userUsecase) UpdateProfile(user *domain.User) error {
	existingUser, err := u.userRepo.GetByID(user.ID)
	if err != nil {
		return err
	}

	user.Password = existingUser.Password // Keep the existing password
	user.UpdatedAt = time.Now()

	return u.userRepo.Update(user)
}
