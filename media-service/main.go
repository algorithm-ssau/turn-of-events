package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"time"

	// AWS SDK v2
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"

	// Google Cloud Storage client
	"cloud.google.com/go/storage"
)

var (
	s3Client  *s3.Client
	s3Bucket  = os.Getenv("S3_BUCKET")
	gcsBucket = os.Getenv("GCS_BUCKET")
)

func main() {
	// Читаем переменную S3_ENDPOINT для кастомного endpoint (например, MinIO)
	s3Endpoint := os.Getenv("S3_ENDPOINT")
	var cfg aws.Config
	var err error

	if s3Endpoint != "" {
		cfg, err = config.LoadDefaultConfig(context.TODO(), config.WithEndpointResolver(
			aws.EndpointResolverFunc(func(service, region string) (aws.Endpoint, error) {
				if service == s3.ServiceID {
					return aws.Endpoint{
						URL:           s3Endpoint,
						SigningRegion: os.Getenv("AWS_REGION"),
					}, nil
				}
				return aws.Endpoint{}, &aws.EndpointNotFoundError{}
			}),
		))
		if err != nil {
			log.Fatalf("Ошибка загрузки AWS конфигурации с кастомным endpoint: %v", err)
		}
	} else {
		cfg, err = config.LoadDefaultConfig(context.TODO())
		if err != nil {
			log.Fatalf("Ошибка загрузки AWS конфигурации: %v", err)
		}
	}

	s3Client = s3.NewFromConfig(cfg)

	http.HandleFunc("/upload", uploadHandler)

	fmt.Println("Сервис запущен на порту :8088")
	log.Fatal(http.ListenAndServe(":8088", nil))
}

// uploadHandler обрабатывает HTTP-запросы на загрузку файла
func uploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
		return
	}

	// Парсинг multipart-формы (максимум 10 МБ в памяти)
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Ошибка парсинга формы", http.StatusBadRequest)
		return
	}

	// Получаем файл из формы с именем "file"
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Ошибка получения файла", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Определяем хранилище: ?storage=s3 или ?storage=gcs (по умолчанию S3)
	storageType := r.URL.Query().Get("storage")
	var fileURL string
	if storageType == "gcs" {
		fileURL, err = uploadToGCS(file, fileHeader)
	} else {
		fileURL, err = uploadToS3(file, fileHeader)
	}
	if err != nil {
		http.Error(w, "Ошибка загрузки файла: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Файл успешно загружен: %s", fileURL)
}

// uploadToS3 загружает файл в Amazon S3 (или совместимое хранилище, например, MinIO) и возвращает публичный URL
func uploadToS3(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	// Чтение содержимого файла
	fileContent, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	// Формирование уникального имени файла с использованием Unix-времени
	fileName := fmt.Sprintf("%d-%s", time.Now().Unix(), fileHeader.Filename)

	input := &s3.PutObjectInput{
		Bucket:      aws.String(s3Bucket),
		Key:         aws.String(fileName),
		Body:        io.NopCloser(bytes.NewReader(fileContent)),
		ContentType: aws.String(fileHeader.Header.Get("Content-Type")),
		ACL:         types.ObjectCannedACLPublicRead, // Делаем файл публично доступным
	}

	_, err = s3Client.PutObject(context.TODO(), input)
	if err != nil {
		return "", err
	}

	// Формирование URL для доступа к файлу (может варьироваться в зависимости от конфигурации S3)
	url := fmt.Sprintf("https://%s.s3.amazonaws.com/%s", s3Bucket, fileName)
	return url, nil
}

// uploadToGCS загружает файл в Google Cloud Storage и возвращает публичный URL
func uploadToGCS(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		return "", err
	}
	defer client.Close()

	fileName := fmt.Sprintf("%d-%s", time.Now().Unix(), fileHeader.Filename)
	bucket := client.Bucket(gcsBucket)
	object := bucket.Object(fileName)
	writer := object.NewWriter(ctx)
	writer.ContentType = fileHeader.Header.Get("Content-Type")

	// Запись данных в объект
	if _, err := io.Copy(writer, file); err != nil {
		return "", err
	}
	if err := writer.Close(); err != nil {
		return "", err
	}

	// Делаем объект публичным
	if err := object.ACL().Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
		return "", err
	}

	url := fmt.Sprintf("https://storage.googleapis.com/%s/%s", gcsBucket, fileName)
	return url, nil
}
