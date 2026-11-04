# BÁO CÁO TỔNG QUAN TOÀN BỘ DỰ ÁN GR1

**Tên dự án:** Nền tảng trao đổi đồ cũ GR1  
**Ngày đánh giá:** 19/07/2026  
**Phạm vi:** Toàn bộ mã nguồn frontend, backend, cơ sở dữ liệu, cấu hình, tài liệu và trạng thái kiểm thử trong workspace hiện tại  
**Trạng thái mã nguồn:** Báo cáo được lập theo working tree hiện tại, bao gồm cả các thay đổi chưa commit.

## 1. Tóm tắt điều hành

GR1 là ứng dụng web kết nối người có nhu cầu bán, trao đổi hoặc tặng đồ cũ với người tìm kiếm sản phẩm. Hệ thống sử dụng kiến trúc client–server, gồm SPA React ở frontend, REST API NestJS ở backend và PostgreSQL/PostGIS làm tầng dữ liệu.

Dự án đã hình thành đầy đủ khung chức năng chính: đăng ký/đăng nhập, hồ sơ người dùng, phân quyền quản trị, danh mục, đăng và tìm kiếm sản phẩm, tìm kiếm theo vị trí, nhắn tin, báo cáo vi phạm và xử lý báo cáo. Cả frontend và backend đều build production thành công ở trạng thái hiện tại.

Mức độ sẵn sàng tổng thể được đánh giá là **MVP đang phát triển, chưa sẵn sàng triển khai production**. Các nguyên nhân chính là chưa có kiểm thử hữu hiệu, E2E đang lỗi, lint backend còn nhiều lỗi, xác thực phía frontend chưa bảo vệ vai trò admin, cấu hình production còn cứng theo localhost, và một số mô hình “mở rộng tương lai” mới dừng ở tầng cơ sở dữ liệu.

## 2. Phạm vi và phương pháp đánh giá

Báo cáo dựa trên:

- Kiểm kê toàn bộ file mã nguồn, package, migration và tài liệu.
- Đọc cấu hình routing, module, controller, service, API client và Prisma schema.
- Đối chiếu luồng frontend–backend.
- Chạy build production cho cả hai ứng dụng.
- Chạy unit test, E2E test và ESLint backend không tự động sửa file.
- Kiểm tra trạng thái Git để phân biệt mã đã commit và thay đổi đang phát triển.

Không thực hiện kiểm thử tích hợp với PostgreSQL/PostGIS thật, kiểm thử trình duyệt, tải, bảo mật xâm nhập hoặc triển khai lên hạ tầng production.

## 3. Tổng quan sản phẩm

### 3.1. Đối tượng sử dụng

- **SEEKER:** tìm kiếm sản phẩm, xem chi tiết, liên hệ và báo cáo vi phạm.
- **PROVIDER:** đăng và quản lý sản phẩm, trao đổi với người quan tâm.
- **ADMIN:** quản lý người dùng và xử lý báo cáo.

### 3.2. Nghiệp vụ chính

- Giao dịch theo ba hình thức: `SELL`, `EXCHANGE`, `DONATE`.
- Theo dõi trạng thái sản phẩm: `AVAILABLE`, `SOLD`, `EXCHANGED`, `DONATED`.
- Phân loại tình trạng sản phẩm: mới, gần như mới, tốt, trung bình, kém.
- Tìm kiếm theo từ khóa, danh mục, loại giao dịch, giá và vị trí.
- Nhắn tin trực tiếp giữa người dùng.
- Báo cáo người dùng hoặc sản phẩm theo các lý do spam, lừa đảo, nội dung không phù hợp hoặc lý do khác.

## 4. Kiến trúc hệ thống

```text
Trình duyệt
   │
   │ React SPA / Axios / JWT
   ▼
Frontend (Vite, cổng 5173)
   │  /api được proxy khi phát triển
   ▼
Backend REST API (NestJS, cổng 3000)
   │  Prisma ORM + truy vấn SQL không gian
   ▼
PostgreSQL + PostGIS
```

### 4.1. Frontend

- React 19, TypeScript, Vite 8.
- React Router cho điều hướng SPA.
- Axios cho giao tiếp API và tự động gắn Bearer token.
- React Query đã được cài đặt để quản lý dữ liệu bất đồng bộ.
- Tailwind CSS v4, Lucide React và React Hot Toast cho giao diện.
- AuthContext quản lý người dùng và token trong `localStorage`.

Các trang chính: trang chủ, danh sách/chi tiết/tạo sản phẩm, đăng nhập, đăng ký, hồ sơ, chat và quản trị.

### 4.2. Backend

- NestJS 11 và TypeScript.
- Kiến trúc module theo miền: `auth`, `users`, `categories`, `products`, `messages`, `reports`, `prisma`.
- JWT guard được đăng ký toàn cục; endpoint công khai dùng decorator `@Public()`.
- Roles guard dùng để hạn chế endpoint quản trị.
- ValidationPipe toàn cục bật whitelist, cấm trường ngoài DTO và chuyển đổi kiểu ngầm định.
- Swagger được phục vụ tại `/api/docs`.

### 4.3. Cơ sở dữ liệu

Prisma schema có 11 model:

| Nhóm | Model | Vai trò |
| --- | --- | --- |
| Cốt lõi | User | Tài khoản, vai trò, trạng thái hoạt động |
| Cốt lõi | Category | Danh mục sản phẩm |
| Cốt lõi | Product | Nội dung và trạng thái sản phẩm |
| Cốt lõi | ProductImage | Hình ảnh sản phẩm |
| Cốt lõi | Location | Địa chỉ, tọa độ và điểm PostGIS |
| Giao tiếp | Message | Tin nhắn giữa hai người dùng |
| Kiểm duyệt | Report | Báo cáo người dùng/sản phẩm |
| Mở rộng | UserPreference | Sở thích cá nhân hóa |
| Mở rộng | UserBehavior | Lịch sử hành vi |
| Mở rộng | RecommendationHistory | Lịch sử đề xuất |
| Mở rộng | ExchangeRequest | Yêu cầu trao đổi sản phẩm |

Schema có các index phù hợp cho phần lớn truy vấn sản phẩm, tin nhắn, báo cáo và lịch sử. PostGIS được bổ sung qua migration và trường `geography(Point, 4326)`.

## 5. Chức năng và mức độ hoàn thiện

| Phân hệ | Backend | Frontend | Đánh giá |
| --- | --- | --- | --- |
| Đăng ký/đăng nhập JWT | Có | Có | Hoạt động ở mức MVP |
| Hồ sơ cá nhân | Có | Có | Có xem/cập nhật |
| Quản lý người dùng | Có, giới hạn ADMIN | Có trang admin | Cần khóa route theo role ở frontend |
| Danh mục | Đọc công khai, tạo bởi ADMIN | Đọc danh mục | Chưa có giao diện quản trị đầy đủ |
| Sản phẩm | CRUD, trạng thái, quyền sở hữu | Danh sách, chi tiết, tạo, hồ sơ | Chức năng trọng tâm đã có |
| Tìm kiếm vị trí | Có DTO, PostGIS và truy vấn tìm kiếm | Có gửi tham số tìm kiếm | Nâng cao nhưng cần test DB thật |
| Nhắn tin | Gửi, hội thoại, danh sách, đánh dấu đã đọc | Có trang chat | Polling/REST, chưa realtime |
| Báo cáo vi phạm | Tạo và admin xử lý | Có API và trang admin | Có thể khóa user/xóa product |
| Đề xuất cá nhân hóa | Chỉ có model dữ liệu | Chưa có | Chưa triển khai nghiệp vụ |
| Yêu cầu trao đổi | Chỉ có model dữ liệu | Chưa có | Chưa triển khai nghiệp vụ |

## 6. Bề mặt API hiện có

Tất cả endpoint có tiền tố `/api`.

| Nhóm | Endpoint chính | Truy cập |
| --- | --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login` | Công khai |
| Users | `GET/PATCH /users/me` | Đã đăng nhập |
| Users | `GET /users`, `PATCH /users/:id/toggle-active` | ADMIN |
| Categories | `GET /categories`, `GET /categories/:id` | Công khai |
| Categories | `POST /categories` | ADMIN |
| Products | `GET /products`, `GET /products/search`, `GET /products/:id` | Công khai |
| Products | `POST /products`, `GET /products/my-products` | Đã đăng nhập |
| Products | `PATCH /products/:id`, `PATCH /products/:id/status`, `DELETE /products/:id` | Chủ sở hữu; xóa hỗ trợ ADMIN |
| Messages | `POST /messages`, `GET /messages`, `GET /messages/:userId`, `PATCH /messages/:senderId/read` | Đã đăng nhập |
| Reports | `POST /reports` | Đã đăng nhập |
| Reports | `GET /reports`, `GET /reports/:id`, `PATCH /reports/:id/handle` | ADMIN |

## 7. Kết quả kiểm chứng kỹ thuật

### 7.1. Build

| Hạng mục | Kết quả | Ghi chú |
| --- | --- | --- |
| Backend `npm run build` | **Đạt** | NestJS biên dịch thành công |
| Frontend `npm run build` | **Đạt** | TypeScript và Vite build thành công |
| Frontend bundle | **422,31 kB JS** | Khoảng 127,97 kB gzip; chưa phải vấn đề nghiêm trọng cho MVP |

### 7.2. Kiểm thử

| Hạng mục | Kết quả | Nguyên nhân |
| --- | --- | --- |
| Unit test backend | **Không đạt** | Không có file `*.spec.ts`; Jest thoát mã 1 |
| E2E backend | **Không đạt** | Test scaffold vẫn kỳ vọng `GET /` trả `Hello World!`, trong khi ứng dụng không có route này |
| Frontend test | **Chưa có** | `package.json` không có test runner hoặc script test |

Như vậy, build thành công chỉ xác nhận mã có thể biên dịch; chưa có bằng chứng tự động rằng nghiệp vụ hoạt động đúng.

### 7.3. Chất lượng mã

ESLint backend ghi nhận **69 vấn đề: 65 lỗi và 4 cảnh báo**. Trong đó:

- 29 lỗi có thể tự động sửa, chủ yếu là định dạng Prettier.
- Nhiều vị trí dùng `any` không an toàn trong decorator, guard, message service và product service.
- Có import không sử dụng trong products controller và messages service.
- Hàm `bootstrap()` tạo promise chưa được xử lý rõ ràng.
- Các đoạn truy vấn/tìm kiếm sản phẩm phức tạp cần type chặt hơn.

Frontend chưa có cấu hình lint, nên chưa có cổng kiểm tra chất lượng tương đương.

## 8. Điểm mạnh

- Phân chia frontend/backend và module nghiệp vụ rõ ràng, dễ mở rộng.
- DTO validation và JWT guard được áp dụng toàn cục ở backend.
- Mật khẩu được băm bằng bcrypt; phản hồi đăng nhập không trả password.
- Prisma model có quan hệ, cascade/set-null và index khá đầy đủ.
- Sản phẩm hỗ trợ nhiều loại giao dịch và trạng thái phù hợp bài toán đồ cũ.
- Có Swagger, seed data, migration và `.env.example` hỗ trợ onboarding.
- Đã có nền tảng tìm kiếm địa lý với PostGIS và dữ liệu hành chính.
- Frontend và backend hiện đều biên dịch thành công.

## 9. Rủi ro và tồn tại

### 9.1. Mức ưu tiên cao

1. **Thiếu kiểm thử tự động:** Không có unit test hữu hiệu; E2E duy nhất là test mẫu đã lỗi. Mọi thay đổi nghiệp vụ có nguy cơ gây hồi quy mà không được phát hiện.
2. **Route admin phía frontend chưa kiểm tra role:** `ProtectedRoute` chỉ thể hiện yêu cầu đăng nhập; người dùng thường vẫn có thể mở `/admin`. Backend vẫn chặn API nên chưa thành lỗ hổng phân quyền trực tiếp, nhưng UX và kiểm soát giao diện chưa đúng.
3. **JWT lưu trong localStorage:** Token có thể bị lấy nếu xuất hiện XSS. Production nên cân nhắc cookie `HttpOnly`, `Secure`, `SameSite` cùng chiến lược CSRF phù hợp.
4. **Cấu hình CORS và API thiên về development:** Origin được ghi cứng theo localhost; frontend dùng `/api` phụ thuộc proxy Vite. Cần biến môi trường và cấu hình reverse proxy khi triển khai.
5. **Chưa có CI/CD:** Không thấy workflow tự động chạy build, lint, test và migration trước khi tích hợp/triển khai.

### 9.2. Mức ưu tiên trung bình

1. **69 lỗi/cảnh báo lint backend:** Làm giảm tính nhất quán và che khuất lỗi type thật.
2. **Nhắn tin chưa realtime:** REST đáp ứng MVP nhưng trải nghiệm chat cần polling hoặc WebSocket.
3. **Xử lý báo cáo xóa sản phẩm vật lý:** `blockProduct` gọi delete trực tiếp; khó khôi phục và thiếu audit log. Nên dùng trạng thái ẩn/khóa mềm.
4. **Thiếu xác thực quan hệ nghiệp vụ ở một số thao tác:** Cần test rõ trường hợp gửi tin cho user không tồn tại, tự nhắn cho chính mình, báo cáo mục tiêu không tồn tại hoặc báo cáo trùng.
5. **Dùng `Float` cho giá:** Có nguy cơ sai số tiền tệ; nên dùng `Decimal` hoặc số nguyên theo đơn vị nhỏ nhất.
6. **Swagger có thể chưa mô tả đầy đủ response/error:** Có tag và operation nhưng chưa thấy contract phản hồi thống nhất.
7. **Không có rate limiting:** Endpoint login, register, message, report và search có thể bị lạm dụng.

### 9.3. Mức ưu tiên thấp

- README trong lần đọc terminal có dấu hiệu hiển thị sai encoding tiếng Việt; cần chuẩn hóa UTF-8 và kiểm tra trên nền tảng đích.
- Một số file HTML mẫu nằm ngoài ứng dụng React, dễ gây nhầm lẫn về nguồn giao diện chính.
- Chưa có trang 404 rõ ràng trong routing frontend.
- Chưa thấy logging có cấu trúc, health check, metrics hoặc theo dõi lỗi production.
- Các model recommendation/exchange đã tồn tại nhưng chưa có service/API/UI, làm schema đi trước nghiệp vụ.

## 10. Bảo mật

### Điểm đã làm tốt

- Băm mật khẩu bằng bcrypt với cost 10.
- JWT có thời hạn cấu hình được.
- Guard xác thực mặc định bảo vệ toàn bộ API; chỉ endpoint gắn `@Public()` mới được mở.
- Roles guard bảo vệ thao tác quản trị ở backend.
- ValidationPipe lọc trường ngoài DTO.
- Prisma giảm rủi ro SQL injection ở truy vấn chuẩn; các truy vấn raw cần tiếp tục dùng tham số hóa.

### Việc cần bổ sung trước production

- Bắt buộc secret mạnh và không dùng giá trị mẫu.
- Rate limit và chống brute force đăng nhập.
- Helmet/security headers, giới hạn kích thước request và chính sách upload file.
- Xác minh MIME, kích thước, tên file và nơi lưu file upload.
- Refresh token/revocation hoặc phiên cookie an toàn.
- Audit log cho admin, báo cáo, khóa tài khoản và thay đổi trạng thái sản phẩm.
- Kiểm tra dependency vulnerability trong CI.
- Chính sách backup/restore PostgreSQL và migration rollback.

## 11. Trạng thái Git và quản trị cấu hình

Repository hiện có nhiều file đã sửa và file mới chưa commit ở cả frontend và backend, đáng chú ý là tìm kiếm địa lý/PostGIS, dữ liệu sản phẩm, trang admin/chat và một số trang sản phẩm. Điều này cho thấy dự án đang trong giai đoạn phát triển tích cực.

Hai commit được quan sát gần nhất:

- `88faaf6` — cập nhật tài liệu kỹ thuật toàn diện.
- `c2901c8` — commit khởi tạo dự án.

Khuyến nghị chia thay đổi hiện tại thành các commit theo chức năng, tránh gom migration, dữ liệu, UI và sửa nghiệp vụ vào một commit lớn.

## 12. Đề xuất lộ trình

### Giai đoạn 1 — Ổn định nền tảng

1. Sửa E2E test hiện tại và thêm test cho auth, quyền sở hữu sản phẩm, admin role và validation.
2. Xử lý toàn bộ lint error; thay `any` bằng type người dùng/JWT và type kết quả truy vấn.
3. Thêm lint/test cho frontend và trang 404.
4. Tách cấu hình API URL, CORS, JWT, upload và PostGIS theo môi trường.
5. Thêm CI chạy install, Prisma generate, build, lint và test.

### Giai đoạn 2 — Hoàn thiện MVP

1. Khóa route admin theo role và chuẩn hóa xử lý 401/403.
2. Bổ sung test tích hợp PostgreSQL/PostGIS cho tìm kiếm khoảng cách và địa giới.
3. Thêm phân trang/giới hạn cho message và các danh sách quản trị.
4. Chuyển xóa sản phẩm do báo cáo sang soft delete/trạng thái ẩn.
5. Hoàn thiện upload ảnh và chính sách bảo mật file.

### Giai đoạn 3 — Sẵn sàng production

1. Docker hóa hoặc chuẩn hóa quy trình deploy, reverse proxy và HTTPS.
2. Health check, structured logging, monitoring và error tracking.
3. Rate limiting, security headers, audit log và backup/restore.
4. Kiểm thử E2E trình duyệt cho các hành trình chính.
5. Tối ưu bundle frontend và truy vấn database dựa trên đo đạc thực tế.

### Giai đoạn 4 — Tính năng mở rộng

1. Hoàn thiện luồng `ExchangeRequest` từ API đến UI.
2. Xây dựng recommendation dựa trên preference/behavior/history.
3. Nâng chat lên realtime bằng WebSocket và thông báo chưa đọc.
4. Bổ sung yêu thích/lưu sản phẩm, đánh giá uy tín và thông báo.

## 13. Tiêu chí đề xuất để phát hành MVP

Chỉ nên phát hành MVP khi đạt tối thiểu:

- Backend và frontend build, lint, test đều xanh trong CI.
- Có test cho đăng ký, đăng nhập, phân quyền, CRUD sản phẩm, tìm kiếm và báo cáo.
- Không thể truy cập giao diện hoặc API admin bằng tài khoản thường.
- Cấu hình production không chứa localhost hoặc secret mẫu.
- Upload ảnh được kiểm soát an toàn.
- Có health check, log lỗi, backup database và quy trình rollback.
- Các luồng chính được kiểm thử trên trình duyệt với database production-like.

## 14. Kết luận

GR1 có nền tảng kiến trúc tốt cho một đồ án/MVP và đã vượt qua giai đoạn dựng khung: các phân hệ cốt lõi, giao diện chính, schema dữ liệu và tìm kiếm địa lý đều đã hiện diện; build hai phía thành công. Điểm yếu lớn nhất hiện không nằm ở số lượng tính năng mà ở độ tin cậy kỹ thuật: gần như chưa có kiểm thử, E2E lỗi, lint còn nhiều vấn đề và cấu hình triển khai/bảo mật chưa hoàn thiện.

Ưu tiên đúng trong giai đoạn tiếp theo là **ổn định và kiểm chứng các chức năng hiện có trước khi mở rộng recommendation hoặc exchange workflow**. Sau khi hoàn tất Giai đoạn 1 và 2, dự án có thể đạt mức MVP demo đáng tin cậy; để vận hành production cần tiếp tục bổ sung CI/CD, bảo mật, quan sát hệ thống và quy trình dữ liệu.
