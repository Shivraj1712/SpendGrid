include server/.env
export
.PHONY : run-server tidy migrate-up migrate-down migrate-status
run-server:
	cd server && air
tidy:
	cd server && go mod tidy
migrate-up:
	goose -dir server/migrations postgres "$(DATABASE_URL)" up
migrate-down:
	goose -dir server/migratio.ns postgres "$(DATABASE_URL)" down
migrate-status:
	goose -dir server/migrations postgres "$(DATABASE_URL)" status
