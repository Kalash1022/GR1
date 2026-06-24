# GR1 - Nền tảng trao đổi đồ cũ

Ứng dụng web hỗ trợ đăng bán, trao đổi và tặng đồ cũ.

## Công nghệ sử dụng

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: NestJS, TypeScript, Prisma
- Cơ sở dữ liệu: PostgreSQL
- Xác thực: JWT

## Yêu cầu

- Node.js `20.19+` hoặc `22.12+`
- npm
- PostgreSQL

## Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone https://github.com/Kalash1022/GR1.git
cd GR1
```

### 2. Cấu hình backend

Di chuyển vào thư mục backend và cài dependencies:

```bash
cd backend
npm install
```

Tạo file `.env` từ file mẫu:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Mở file `backend/.env` và cập nhật chuỗi kết nối PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/gr1?schema=public"
JWT_SECRET="thay-bang-chuoi-bi-mat-cua-ban"
JWT_EXPIRATION="7d"
PORT=3000
UPLOAD_DIR="uploads"
```

Tạo database `gr1` trong PostgreSQL, sau đó chạy migration, tạo Prisma Client và dữ liệu mẫu:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

Khởi động backend:

```bash
npm run start:dev
```

Backend chạy tại `http://localhost:3000`. Swagger API có tại:

```text
http://localhost:3000/api/docs
```

### 3. Cấu hình frontend

Mở terminal mới tại thư mục gốc dự án:

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại:

```text
http://localhost:5173
```

Vite tự chuyển tiếp các request `/api` sang backend tại cổng `3000`.

## Tài khoản mẫu

Sau khi chạy seed, có thể đăng nhập bằng:

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Admin | `admin@secondhand.com` | `admin123` |
| Người đăng sản phẩm | `provider@example.com` | `provider123` |
| Người tìm sản phẩm | `seeker@example.com` | `seeker123` |

Các tài khoản này chỉ dùng cho môi trường phát triển.

## Build production

Backend:

```bash
cd backend
npm run build
npm run start:prod
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

## Cấu trúc thư mục

```text
GR1/
├── backend/     # NestJS API, Prisma schema và migrations
├── frontend/    # React + Vite
└── README.md
```
