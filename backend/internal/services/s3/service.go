package s3

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

const (
	BucketName = "christian-hub-bucket"
	Region     = "eu-north-1"
)

type Service struct {
	client *s3.Client
}

func NewService() (*Service, error) {
	// Load AWS configuration
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(Region),
		config.WithSharedConfigProfile("default"),
	)
	if err != nil {
		return nil, fmt.Errorf("unable to load SDK config: %w", err)
	}

	// Create S3 client
	client := s3.NewFromConfig(cfg)

	// Test the connection
	_, err = client.ListBuckets(context.TODO(), &s3.ListBucketsInput{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to S3: %w", err)
	}

	return &Service{
		client: client,
	}, nil
}

// UploadFile uploads a file to S3 and returns the URL
func (s *Service) UploadFile(ctx context.Context, file *multipart.FileHeader, folder string) (string, error) {
	// Open the file
	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer src.Close()

	// Generate a unique filename
	filename := fmt.Sprintf("%d-%s", time.Now().UnixNano(), filepath.Base(file.Filename))
	key := fmt.Sprintf("%s/%s", folder, filename)

	// Upload to S3
	_, err = s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(BucketName),
		Key:         aws.String(key),
		Body:        src,
		ContentType: aws.String(file.Header.Get("Content-Type")),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload to S3: %w", err)
	}

	// Generate the URL for the uploaded file
	url := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", BucketName, Region, key)
	return url, nil
}

// UploadPostBackup uploads a post as JSON to S3 for backup purposes
func (s *Service) UploadPostBackup(ctx context.Context, postData []byte, postID string) (string, error) {
	// Generate a unique filename with timestamp
	timestamp := time.Now().UnixNano()
	key := fmt.Sprintf("backups/posts/post-%d-%s.json", timestamp, postID)

	// Upload to S3
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(BucketName),
		Key:         aws.String(key),
		Body:        bytes.NewReader(postData),
		ContentType: aws.String("application/json"),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload post backup to S3: %w", err)
	}

	// Generate the URL for the uploaded file
	url := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", BucketName, Region, key)
	return url, nil
}

// LogUserActivity uploads a user activity log to S3
func (s *Service) LogUserActivity(ctx context.Context, username string, activityType string, details string) (string, error) {
	// Generate timestamp and filename
	timestamp := time.Now().UnixNano()
	key := fmt.Sprintf("logs/%s/%s_%d.txt", activityType, username, timestamp)

	// Create log content
	logContent := fmt.Sprintf("Timestamp: %s\nUsername: %s\nActivity: %s\nDetails: %s\n",
		time.Now().Format(time.RFC3339),
		username,
		activityType,
		details,
	)

	// Upload to S3
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(BucketName),
		Key:         aws.String(key),
		Body:        bytes.NewReader([]byte(logContent)),
		ContentType: aws.String("text/plain"),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload user activity log to S3: %w", err)
	}

	// Generate the URL for the uploaded file
	url := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", BucketName, Region, key)
	return url, nil
}

// DeleteFile deletes a file from S3
func (s *Service) DeleteFile(ctx context.Context, key string) error {
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(key),
	})
	if err != nil {
		return fmt.Errorf("failed to delete from S3: %w", err)
	}
	return nil
}

// GetFile retrieves a file from S3
func (s *Service) GetFile(ctx context.Context, key string) (io.ReadCloser, error) {
	result, err := s.client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(key),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get object from S3: %w", err)
	}
	return result.Body, nil
}
