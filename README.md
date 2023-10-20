# Blog

### Setup
1. Создать новый .env файл и заполнить его по примеру .env.sample 
2. Создать новый .production.env файл и заполнить его по примеру .env.production.sample 
3. Изменить файл ./db/typeorm.config.ts под необходимую конфигурацию
4. Запустить миграции командой npm run migration:run
5. Запустить приложение командой docker compose up -d --build