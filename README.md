# Hệ thống Quản lý Đặt chỗ

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file .env từ file .env.example và cập nhật các biến môi trường

4. Chạy ứng dụng:

- Môi trường development:

```bash
npm run dev
```

- Môi trường production:

```bash
npm start
```

## Cấu trúc thư mục

```
src/
├── config/         # Cấu hình (database, env, ...)
├── controllers/    # Logic xử lý
├── models/        # Schema models
├── routes/        # Định tuyến API
├── middleware/    # Middleware
└── index.js       # Entry point
```

## API Endpoints

- GET / : Kiểm tra server
- Các endpoint khác sẽ được thêm sau

## Công nghệ sử dụng

- Node.js
- Express
- MongoDB
- Mongoose
