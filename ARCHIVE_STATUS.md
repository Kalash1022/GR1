# Trạng thái bản lưu GR1

Cập nhật 04/11/2026. Bản lưu gồm mã đã commit, các thay đổi local chưa được đẩy trước đây và tài liệu thiết kế riêng ở `archive-design/`. Lịch sử Git và remote cá nhân ban đầu được giữ lại.

## Phạm vi hiện tại

- React/Vite: đăng ký/đăng nhập, danh sách và chi tiết sản phẩm, tạo/sửa tin, hồ sơ, chat polling và giao diện xử lý báo cáo/người dùng.
- NestJS/Prisma/PostgreSQL: xác thực/phân quyền, sản phẩm và nhiều danh mục, tags/thuộc tính động, tìm kiếm theo từ khóa và vị trí, nhắn tin, quản lý báo cáo/người dùng.
- Mô hình đề xuất và yêu cầu trao đổi đã có bảng dữ liệu; thuật toán recommendation và vòng đời giao dịch trao đổi đầy đủ vẫn là phần mở rộng. Không xem sự tồn tại của bảng là tính năng đã hoàn thành.

## Sửa để có thể lưu và dựng lại

- Đồng bộ schema Prisma và migration với mã dùng nhiều danh mục, tags, `attributes` và `formSchema`; migration bảo toàn liên kết danh mục cũ, khôi phục chỉ mục vị trí.
- Sửa tạo sản phẩm để kết nối đúng các quan hệ, chuẩn hóa và loại tags trùng; sửa SQL tìm kiếm theo bảng `tags` và quan hệ danh mục.
- Chặn đăng ký Admin công khai; yêu cầu cấu hình `JWT_SECRET`; kiểm tra số nguyên cho phân trang, giới hạn tọa độ/giá và trạng thái sản phẩm hợp lệ.
- Thay bài kiểm thử scaffold cũ bằng kiểm tra HTTP đầu vào và bổ sung kiểm thử hồi quy service; cập nhật tiện ích kiểm tra schema cho Prisma 7.

## Kiểm chứng ngày 04/11/2026

- Backend biên dịch TypeScript thành công.
- Prisma schema hợp lệ; sinh lại Prisma Client 7.8 từ schema đã lưu vào thư mục kiểm chứng riêng và kiểm tra TypeScript với client mới thành công. Không chỉ dựa vào client đã sinh cũ ở máy.
- 5 kiểm thử service và 6 kiểm thử HTTP với service được mô phỏng đều đạt.
- Frontend TypeScript và Vite production build đạt.
- Công cụ Prisma sinh được SQL schema từ trạng thái rỗng; cấu trúc bảng nối/chỉ mục đối chiếu với migration mới.

Chưa chạy migration trên PostgreSQL/PostGIS thật, chưa thử toàn bộ luồng trình duyệt với database và chưa kiểm tra lại mọi giao diện. Các kiểm thử HTTP mô phỏng lớp service nên không chứng minh tích hợp database hoặc toàn bộ xác thực. Không công bố đây là sản phẩm hoàn chỉnh hay đã kiểm thử triển khai production.

Lệnh kiểm tra thông thường sau khi `npm ci` và `prisma generate` trong `backend/`:

```powershell
cd backend
npm.cmd run build
npm.cmd test -- --runInBand
npm.cmd run test:e2e -- --runInBand
npx.cmd prisma validate
cd ../frontend
npm.cmd run build
```

## Dữ liệu local cần giữ riêng

- `.env`, upload thật và bản sao lưu database không đưa lên Git. Bản lưu mã dùng `.env.example` và dữ liệu mẫu có sẵn.
- `archive-design/` giữ các tệp Astah, ảnh ERD và ghi chú GR1. Tệp ghi chú học tập có lẫn nội dung app chấm công công ty được giữ riêng ngoài repository.
- `node_modules/`, `dist/`, cache, `.agents/`, `.codex/`, log và kết quả kiểm chứng là dữ liệu có thể dựng lại, không commit.
