# GR1 - Nền Tảng Trao Đổi Đồ Cũ

Ứng dụng web hỗ trợ đăng bán, trao đổi và tặng đồ cũ. Nền tảng hướng tới việc kết nối người dùng có nhu cầu thanh lý đồ đạc và những người đang tìm kiếm các món đồ đã qua sử dụng với giá tốt hoặc trao đổi vật dụng với nhau.

## Kiến Trúc Hệ Thống
Dự án được thiết kế theo kiến trúc **Client-Server**:
- **Client (Frontend)**: Đảm nhiệm giao diện người dùng (UI) và trải nghiệm người dùng (UX), được xây dựng dưới dạng Single Page Application (SPA).
- **Server (Backend)**: Đảm nhiệm xử lý logic nghiệp vụ, quản lý phân quyền (Authorization/Authentication) và giao tiếp với cơ sở dữ liệu qua RESTful APIs.
- **Database**: Lưu trữ toàn bộ dữ liệu của hệ thống, sử dụng hệ quản trị cơ sở dữ liệu quan hệ (RDBMS).

## Công Nghệ Sử Dụng (Technology Stack)

### Frontend
- **Core**: React 19, TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Data Fetching & State Management**: `@tanstack/react-query`, Axios
- **UI Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Core Framework**: NestJS v11, TypeScript
- **ORM**: Prisma v7
- **Database**: PostgreSQL
- **Xác Thực (Authentication)**: JWT (JSON Web Token), Passport (`passport-jwt`, `passport-local`), bcrypt (mã hóa mật khẩu)
- **API Documentation**: Swagger (`@nestjs/swagger`)
- **Validation**: `class-validator`, `class-transformer`
- **Upload File**: Multer

## Yêu Cầu Cài Đặt
- Node.js `20.19+` hoặc `22.12+`
- npm
- PostgreSQL

## Hướng Dẫn Cài Đặt (Development Environment)

### 1. Clone repository
```bash
git clone https://github.com/Kalash1022/GR1.git
cd GR1
```

### 2. Cấu hình Backend
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
`http://localhost:3000/api/docs`

### 3. Cấu hình Frontend
Mở terminal mới tại thư mục gốc dự án:
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại:
`http://localhost:5173`
Vite tự chuyển tiếp các request `/api` sang backend tại cổng `3000`.

## Tài Khoản Mẫu
Sau khi chạy seed, có thể đăng nhập bằng các tài khoản sau (chỉ dùng cho môi trường phát triển):

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Admin | `admin@secondhand.com` | `admin123` |
| Người đăng sản phẩm | `provider@example.com` | `provider123` |
| Người tìm sản phẩm | `seeker@example.com` | `seeker123` |

## Build Production

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Cấu Trúc Thư Mục
Dự án sử dụng mô hình Monorepo với cấu trúc như sau:
```text
GR1/
├── backend/          # NestJS API
│   ├── prisma/       # Schema database, migrations, và file seed dữ liệu
│   ├── src/          # Source code backend chính
│   │   ├── auth/     # Logic xác thực và phân quyền
│   │   ├── categories/ # Quản lý danh mục
│   │   ├── common/   # Các utility, guard, decorator dùng chung
│   │   ├── messages/ # Quản lý tin nhắn giữa người dùng
│   │   ├── prisma/   # Prisma service
│   │   ├── products/ # Quản lý sản phẩm, trao đổi đồ
│   │   ├── reports/  # Quản lý báo cáo vi phạm
│   │   ├── users/    # Quản lý thông tin và trạng thái người dùng
│   │   ├── app.module.ts # Root module của backend
│   │   └── main.ts   # Entry point
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── api/      # Cấu hình Axios và các API calls
│   │   ├── assets/   # Hình ảnh, font chữ tĩnh
│   │   ├── components/ # Các UI Component dùng chung (Button, Input, Layout, ...)
│   │   ├── context/  # Global state context (ví dụ: AuthContext)
│   │   ├── pages/    # Các trang chính của ứng dụng
│   │   ├── types/    # Định nghĩa interface và type cho TypeScript
│   │   ├── App.tsx   # Cấu hình routing chính
│   │   ├── index.css # File style global, cấu hình Tailwind
│   │   └── main.tsx  # Entry point của React
└── README.md
```

## Mô Hình Cơ Sở Dữ Liệu (Database Schema)
Dữ liệu được quản lý bởi PostgreSQL và Prisma ORM.

### Bảng Dữ Liệu Cốt Lõi
- **User (`users`)**: Thông tin người dùng (email, password băm, role, isActive). Hỗ trợ các vai trò: `PROVIDER`, `SEEKER`, `ADMIN`.
- **Product (`products`)**: Thông tin các mặt hàng. Trạng thái mặt hàng: `AVAILABLE`, `SOLD`, `EXCHANGED`, `DONATED`. Loại giao dịch: `SELL`, `EXCHANGE`, `DONATE`.
- **ProductImage (`product_images`)**: URL hình ảnh liên kết với sản phẩm.
- **Category (`categories`)**: Danh mục sản phẩm (Tên, slug, icon).
- **Location (`locations`)**: Quản lý địa lý sản phẩm (hỗ trợ tính năng tìm kiếm theo vị trí với điểm địa lý).
- **Message (`messages`)**: Hỗ trợ trao đổi tin nhắn trực tiếp giữa 2 người dùng.
- **Report (`reports`)**: Quản lý báo cáo từ người dùng (SPAM, SCAM, INAPPROPRIATE_CONTENT).

### Các Bảng Mở Rộng
- **UserPreference**: Lưu sở thích tìm kiếm của người dùng.
- **UserBehavior**: Tracking hành vi (Xem, tìm kiếm, lưu sản phẩm).
- **RecommendationHistory**: Lịch sử gợi ý sản phẩm.
- **ExchangeRequest**: Quản lý luồng yêu cầu trao đổi sản phẩm giữa 2 người dùng.

## Luồng Xác Thực (Authentication)
1. **Đăng nhập**: Người dùng gửi `email` và `password`. Backend đối chiếu bằng `bcrypt`, tạo **Access Token (JWT)** trả về cho Frontend.
2. **Lưu trữ & Phân quyền**: Frontend lưu token và đính kèm vào Header `Authorization: Bearer <token>`. Backend sử dụng JWT Guard và Roles Guard để chặn request trái phép.

## Định Hướng Phát Triển Tương Lai
- **Hệ thống Đề Xuất (Recommendation System)**: Đề xuất sản phẩm dựa trên hành vi (`UserBehavior`) và thiết lập (`UserPreference`).
- **Giao Dịch Đổi Trực Tiếp**: Xác nhận yêu cầu đổi món thông qua `ExchangeRequest`.
- **Bản Đồ Nâng Cao**: Dùng PostGIS để cải thiện độ chính xác truy vấn không gian.
