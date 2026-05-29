package database

import (
	"github.com/Shivraj1712/SpendGrid.git/internal/config"
	"github.com/Shivraj1712/SpendGrid.git/internal/domain"
	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"
)

var Database *gorm.DB

func ConnectDB() *gorm.DB {
	dsn := config.Configuration.DATABASE_URL
	conn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: gormLogger.Default.LogMode(gormLogger.Silent),
	})
	if err != nil {
		logger.Fatal("Failed to connect to the Database", err)
	}
	logger.Info("Database Connected Successfully")
	sqlDB, err := conn.DB()
	if err != nil {
		logger.Error("Failed to do pooling", err)
	}
	sqlDB.SetMaxOpenConns(50)
	sqlDB.SetMaxIdleConns(5)
	err = conn.AutoMigrate(&domain.User{}, &domain.Expense{})
	if err != nil {
		logger.Error("Auto Migrations of models failed", err)
	}
	return conn
}
