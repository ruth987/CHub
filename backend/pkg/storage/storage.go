package storage

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"
)

type StorageService interface {
	SaveFile(file *multipart.FileHeader) (string, error)
	DeleteFile(filename string) error
}

type localStorage struct {
	uploadDir string
}

func NewLocalStorage(uploadDir string) StorageService {
	// Create uploads directory if it doesn't exist
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		panic(err)
	}
	return &localStorage{uploadDir: uploadDir}
}

func (s *localStorage) SaveFile(file *multipart.FileHeader) (string, error) {
	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	filepath := filepath.Join(s.uploadDir, filename)

	// Open source file
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// Create destination file
	dst, err := os.Create(filepath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	// Copy file content
	if _, err = io.Copy(dst, src); err != nil {
		return "", err
	}

	return filename, nil
}

func (s *localStorage) DeleteFile(filename string) error {
	filepath := filepath.Join(s.uploadDir, filename)
	return os.Remove(filepath)
}
