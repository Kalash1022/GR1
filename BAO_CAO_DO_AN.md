# BÁO CÁO ĐỒ ÁN

## XÂY DỰNG NỀN TẢNG TRAO ĐỔI ĐỒ CŨ GR1

---

**Sinh viên thực hiện:** ........................................................  
**Mã sinh viên:** .................................................................  
**Lớp:** .............................................................................  
**Giảng viên hướng dẫn:** .....................................................  
**Khoa/Viện:** ....................................................................  
**Trường:** .........................................................................  

**Hà Nội, năm 2026**

---

# LỜI CAM ĐOAN

Em xin cam đoan đồ án “Xây dựng nền tảng trao đổi đồ cũ GR1” là kết quả của quá trình nghiên cứu, phân tích và xây dựng của bản thân dưới sự hướng dẫn của giảng viên. Các nội dung tham khảo, công nghệ và thư viện được sử dụng trong đồ án đều được trình bày rõ ràng. Các kết quả, hình ảnh và số liệu trong báo cáo phản ánh đúng quá trình thực hiện tại thời điểm hoàn thành đồ án.

Em xin chịu trách nhiệm về tính trung thực của nội dung báo cáo.

**Sinh viên thực hiện**  

*(Ký và ghi rõ họ tên)*

# LỜI CẢM ƠN

Trong quá trình thực hiện đồ án, em đã nhận được sự hướng dẫn và hỗ trợ từ giảng viên, bạn bè và gia đình. Em xin gửi lời cảm ơn chân thành tới giảng viên hướng dẫn đã đóng góp ý kiến, định hướng phương pháp nghiên cứu và hỗ trợ em giải quyết những khó khăn trong quá trình xây dựng hệ thống.

Em cũng xin cảm ơn các thầy cô trong khoa đã cung cấp kiến thức nền tảng về lập trình, cơ sở dữ liệu, phân tích thiết kế hệ thống và phát triển ứng dụng web. Những kiến thức đó là cơ sở quan trọng để em hoàn thành đồ án này.

Do thời gian và kinh nghiệm còn hạn chế, báo cáo khó tránh khỏi thiếu sót. Em mong nhận được ý kiến đóng góp của thầy cô để hệ thống có thể tiếp tục được hoàn thiện.

# TÓM TẮT ĐỒ ÁN

Sự phát triển của thương mại điện tử làm tăng nhu cầu mua bán trực tuyến, trong đó thị trường đồ đã qua sử dụng ngày càng được quan tâm nhờ giá thành hợp lý và khả năng giảm lãng phí tài nguyên. Tuy nhiên, việc mua bán đồ cũ qua các kênh không chuyên biệt thường gặp khó khăn trong tìm kiếm, trao đổi thông tin, quản lý bài đăng và kiểm soát nội dung vi phạm.

Đồ án xây dựng nền tảng web GR1 nhằm hỗ trợ người dùng đăng bán, trao đổi hoặc tặng đồ cũ. Hệ thống cung cấp các chức năng đăng ký, đăng nhập, quản lý hồ sơ, đăng và tìm kiếm sản phẩm, tìm kiếm theo vị trí, nhắn tin trực tiếp, báo cáo nội dung vi phạm và quản trị người dùng.

Hệ thống được phát triển theo kiến trúc client–server. Frontend sử dụng React và TypeScript; backend sử dụng NestJS; dữ liệu được quản lý bằng PostgreSQL, Prisma ORM và PostGIS. Cơ chế JSON Web Token được sử dụng để xác thực và phân quyền người dùng. Kết quả thực nghiệm cho thấy cả frontend và backend đều có thể biên dịch thành công. Hệ thống đã đáp ứng phần lớn yêu cầu của một sản phẩm khả dụng tối thiểu, tuy nhiên vẫn cần bổ sung kiểm thử tự động, tăng cường bảo mật và hoàn thiện quy trình triển khai trước khi đưa vào môi trường thực tế.

**Từ khóa:** đồ cũ, trao đổi sản phẩm, React, NestJS, PostgreSQL, Prisma, PostGIS, JWT.

# ABSTRACT

The growth of e-commerce has increased the demand for online trading. The second-hand market has attracted significant interest due to affordable prices and its contribution to reducing resource waste. However, trading used products through general-purpose channels often causes difficulties in searching, communication, listing management, and content moderation.

This project develops GR1, a web platform that enables users to sell, exchange, or donate second-hand products. The system provides user registration and authentication, profile management, product listing and search, location-based search, direct messaging, violation reporting, and administrative management.

The system follows a client–server architecture. The frontend is implemented with React and TypeScript, while the backend uses NestJS. PostgreSQL, Prisma ORM, and PostGIS are used for data management and spatial search. JSON Web Token is applied for authentication and authorization. Experimental results show that both applications can be successfully compiled. The system satisfies most requirements of a minimum viable product, although automated testing, security hardening, and production deployment procedures should be further improved.

**Keywords:** second-hand products, product exchange, React, NestJS, PostgreSQL, Prisma, PostGIS, JWT.

# DANH MỤC TỪ VIẾT TẮT

| Từ viết tắt | Ý nghĩa |
| --- | --- |
| API | Application Programming Interface |
| CSDL | Cơ sở dữ liệu |
| DTO | Data Transfer Object |
| HTTP | Hypertext Transfer Protocol |
| JWT | JSON Web Token |
| MVP | Minimum Viable Product – sản phẩm khả dụng tối thiểu |
| ORM | Object–Relational Mapping |
| REST | Representational State Transfer |
| SPA | Single Page Application |
| UI | User Interface – giao diện người dùng |
| UX | User Experience – trải nghiệm người dùng |

# CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI

## 1.1. Đặt vấn đề

Trong đời sống hiện đại, nhiều vật dụng vẫn còn khả năng sử dụng nhưng bị bỏ đi do chủ sở hữu không còn nhu cầu. Việc tái sử dụng các sản phẩm này vừa giúp người bán thu hồi một phần chi phí, vừa giúp người mua tiếp cận sản phẩm với giá hợp lý, đồng thời hạn chế lượng rác thải ra môi trường.

Các hoạt động mua bán đồ cũ hiện nay thường được thực hiện qua mạng xã hội hoặc các nhóm cộng đồng. Các kênh này có ưu điểm là dễ tiếp cận nhưng thiếu công cụ quản lý chuyên biệt. Người dùng khó lọc sản phẩm theo nhu cầu, khó theo dõi trạng thái bài đăng và có nguy cơ gặp nội dung spam hoặc lừa đảo. Vì vậy, việc xây dựng một nền tảng dành riêng cho bán, trao đổi và tặng đồ cũ là cần thiết.

## 1.2. Lý do chọn đề tài

Đề tài được lựa chọn vì ba lý do chính:

- Nhu cầu thanh lý và tìm mua đồ đã qua sử dụng ngày càng phổ biến.
- Bài toán có tính thực tiễn và bao quát nhiều kiến thức phát triển phần mềm như giao diện web, REST API, xác thực, phân quyền và cơ sở dữ liệu.
- Hệ thống có tiềm năng mở rộng sang tìm kiếm không gian, đề xuất cá nhân hóa và trao đổi sản phẩm trực tiếp.

## 1.3. Mục tiêu của đề tài

### 1.3.1. Mục tiêu tổng quát

Xây dựng một ứng dụng web hỗ trợ người dùng đăng tải, tìm kiếm, mua bán, trao đổi hoặc tặng đồ cũ trong một hệ thống thống nhất, dễ sử dụng và có khả năng quản trị nội dung.

### 1.3.2. Mục tiêu cụ thể

- Xây dựng cơ chế đăng ký, đăng nhập và xác thực bằng JWT.
- Phân quyền người dùng theo các vai trò SEEKER, PROVIDER và ADMIN.
- Cho phép người dùng quản lý hồ sơ cá nhân.
- Cho phép đăng, cập nhật, xóa và thay đổi trạng thái sản phẩm.
- Hỗ trợ tìm kiếm, lọc sản phẩm và tìm kiếm theo vị trí.
- Xây dựng chức năng nhắn tin giữa người dùng.
- Xây dựng chức năng báo cáo nội dung hoặc tài khoản vi phạm.
- Cung cấp giao diện quản trị người dùng và báo cáo.
- Thiết kế cơ sở dữ liệu có khả năng mở rộng cho đề xuất và yêu cầu trao đổi.

## 1.4. Đối tượng và phạm vi nghiên cứu

### 1.4.1. Đối tượng nghiên cứu

- Quy trình đăng và tìm kiếm sản phẩm đồ cũ.
- Phương pháp xác thực, phân quyền trong ứng dụng web.
- Mô hình client–server và RESTful API.
- Quản lý dữ liệu quan hệ và dữ liệu vị trí.
- Công nghệ React, NestJS, Prisma, PostgreSQL và PostGIS.

### 1.4.2. Phạm vi thực hiện

Đồ án tập trung xây dựng ứng dụng web gồm frontend và backend. Hệ thống hỗ trợ ba hình thức giao dịch là bán, trao đổi và tặng. Chức năng thanh toán trực tuyến, vận chuyển, định danh người dùng, hệ thống đề xuất hoàn chỉnh và chat thời gian thực chưa thuộc phạm vi phiên bản hiện tại.

## 1.5. Phương pháp thực hiện

Quá trình thực hiện gồm các bước:

1. Khảo sát bài toán và xác định yêu cầu.
2. Phân tích tác nhân, chức năng và dữ liệu.
3. Thiết kế kiến trúc tổng thể và cơ sở dữ liệu.
4. Xây dựng REST API phía backend.
5. Xây dựng giao diện và kết nối API phía frontend.
6. Kiểm tra khả năng biên dịch và đánh giá chất lượng mã nguồn.
7. Tổng hợp kết quả, hạn chế và hướng phát triển.

## 1.6. Cấu trúc báo cáo

Báo cáo gồm sáu chương. Chương 1 giới thiệu đề tài. Chương 2 trình bày cơ sở lý thuyết và công nghệ. Chương 3 phân tích yêu cầu. Chương 4 mô tả thiết kế hệ thống. Chương 5 trình bày quá trình cài đặt và kết quả. Chương 6 đánh giá, kết luận và đề xuất hướng phát triển.

# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ SỬ DỤNG

## 2.1. Kiến trúc client–server

Kiến trúc client–server chia hệ thống thành hai thành phần chính. Client đảm nhiệm hiển thị giao diện, tiếp nhận thao tác và gửi yêu cầu. Server tiếp nhận yêu cầu, xử lý nghiệp vụ, truy xuất cơ sở dữ liệu và trả kết quả. Cách tổ chức này giúp tách biệt giao diện với logic nghiệp vụ, thuận lợi cho bảo trì và mở rộng.

Trong GR1, frontend là một SPA chạy trên trình duyệt. Backend cung cấp REST API qua HTTP. Dữ liệu giữa hai phía chủ yếu được trao đổi dưới dạng JSON.

## 2.2. React và TypeScript

React là thư viện xây dựng giao diện dựa trên component. Mỗi trang hoặc thành phần giao diện có thể được tổ chức thành component độc lập và tái sử dụng. TypeScript bổ sung hệ thống kiểu tĩnh cho JavaScript, giúp phát hiện nhiều lỗi ngay trong quá trình biên dịch.

Frontend của dự án sử dụng React 19, React Router để điều hướng và Axios để gửi HTTP request. Vite được dùng làm công cụ phát triển và đóng gói ứng dụng.

## 2.3. NestJS

NestJS là framework backend cho Node.js được xây dựng trên TypeScript. Framework tổ chức mã nguồn theo module, controller và service. Controller tiếp nhận yêu cầu HTTP; service xử lý nghiệp vụ; module quản lý quan hệ phụ thuộc giữa các thành phần.

Cấu trúc này phù hợp với đồ án vì các miền nghiệp vụ như người dùng, sản phẩm, tin nhắn và báo cáo có thể được tách thành module riêng.

## 2.4. RESTful API

REST là phong cách thiết kế dịch vụ dựa trên tài nguyên và các phương thức HTTP. Dự án sử dụng các phương thức chính:

- `GET`: truy vấn dữ liệu.
- `POST`: tạo tài nguyên mới.
- `PATCH`: cập nhật một phần tài nguyên.
- `DELETE`: xóa tài nguyên.

Các endpoint dùng chung tiền tố `/api`. Swagger được tích hợp để sinh tài liệu và hỗ trợ thử nghiệm API.

## 2.5. JSON Web Token

JWT là một chuỗi token có chữ ký, thường được dùng để xác thực người dùng trong ứng dụng web. Sau khi đăng nhập thành công, backend tạo token chứa mã người dùng, email và vai trò. Frontend gửi token trong header `Authorization: Bearer <token>` ở các yêu cầu cần xác thực.

Backend sử dụng guard để kiểm tra token. Những endpoint công khai được đánh dấu riêng; endpoint quản trị được kiểm tra thêm vai trò ADMIN.

## 2.6. PostgreSQL, PostGIS và Prisma ORM

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở. PostGIS mở rộng PostgreSQL với kiểu dữ liệu và hàm xử lý không gian. Trong dự án, PostGIS hỗ trợ lưu điểm địa lý và tìm kiếm sản phẩm theo khoảng cách.

Prisma là ORM giúp mô tả model dữ liệu, quan hệ và thực hiện truy vấn từ TypeScript. Migration được sử dụng để quản lý thay đổi cấu trúc cơ sở dữ liệu theo từng phiên bản.

## 2.7. Một số thư viện hỗ trợ

- bcrypt: băm và đối chiếu mật khẩu.
- class-validator và class-transformer: kiểm tra dữ liệu đầu vào.
- Tailwind CSS: xây dựng giao diện theo utility class.
- React Query: hỗ trợ quản lý trạng thái dữ liệu bất đồng bộ.
- React Hot Toast: hiển thị thông báo.
- Lucide React: cung cấp biểu tượng giao diện.

# CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG

## 3.1. Các tác nhân

Hệ thống có ba nhóm tác nhân:

### 3.1.1. Khách chưa đăng nhập

- Xem trang chủ.
- Xem danh sách và chi tiết sản phẩm.
- Tìm kiếm, lọc sản phẩm.
- Xem danh mục.
- Đăng ký và đăng nhập.

### 3.1.2. Người dùng đã đăng nhập

- Thực hiện toàn bộ chức năng của khách.
- Xem và cập nhật hồ sơ.
- Đăng và quản lý sản phẩm cá nhân.
- Cập nhật trạng thái sản phẩm.
- Gửi và nhận tin nhắn.
- Báo cáo tài khoản hoặc sản phẩm vi phạm.

Vai trò SEEKER và PROVIDER thể hiện định hướng sử dụng của tài khoản. Trong phiên bản hiện tại, quyền thao tác sản phẩm chủ yếu được xác định dựa trên trạng thái đăng nhập và quyền sở hữu.

### 3.1.3. Quản trị viên

- Xem danh sách người dùng.
- Khóa hoặc mở khóa tài khoản.
- Xem và xử lý báo cáo.
- Khóa người dùng hoặc loại bỏ sản phẩm bị báo cáo.
- Tạo danh mục mới qua API.

## 3.2. Yêu cầu chức năng

### 3.2.1. Quản lý tài khoản

- Hệ thống cho phép đăng ký bằng tên, email và mật khẩu.
- Email phải duy nhất.
- Mật khẩu được băm trước khi lưu.
- Người dùng có thể đăng nhập bằng email và mật khẩu.
- Tài khoản bị khóa không thể đăng nhập.
- Người dùng có thể cập nhật thông tin hồ sơ.

### 3.2.2. Quản lý sản phẩm

- Người dùng đã đăng nhập có thể tạo sản phẩm.
- Sản phẩm có tiêu đề, mô tả, giá, tình trạng, loại giao dịch, danh mục, hình ảnh và vị trí.
- Chủ sở hữu có thể cập nhật hoặc xóa sản phẩm.
- Chủ sở hữu có thể thay đổi trạng thái thành đã bán, đã trao đổi hoặc đã tặng.
- Quản trị viên có thể xóa sản phẩm khi xử lý vi phạm.

### 3.2.3. Tìm kiếm sản phẩm

- Tìm theo từ khóa.
- Lọc theo danh mục, loại giao dịch, trạng thái và khoảng giá.
- Sắp xếp và phân trang kết quả.
- Tìm theo tỉnh, huyện, xã hoặc bán kính từ một tọa độ.

### 3.2.4. Nhắn tin

- Người dùng gửi tin nhắn cho người dùng khác.
- Hệ thống hiển thị danh sách hội thoại và tin nhắn mới nhất.
- Hiển thị số tin chưa đọc.
- Cho phép đánh dấu tin nhắn đã đọc.

### 3.2.5. Báo cáo và quản trị

- Người dùng có thể báo cáo sản phẩm hoặc tài khoản.
- Báo cáo có lý do, nội dung chi tiết và trạng thái xử lý.
- Quản trị viên có thể xem báo cáo, thay đổi trạng thái, khóa người dùng hoặc xử lý sản phẩm.

## 3.3. Yêu cầu phi chức năng

### 3.3.1. Hiệu năng

- Các danh sách lớn cần hỗ trợ phân trang.
- Các trường tìm kiếm phổ biến cần được đánh index.
- Kết quả tìm kiếm vị trí cần sử dụng khả năng truy vấn không gian của PostGIS.

### 3.3.2. Bảo mật

- Mật khẩu không được lưu dưới dạng văn bản thuần.
- Endpoint riêng tư phải yêu cầu JWT hợp lệ.
- Endpoint quản trị phải kiểm tra vai trò.
- Dữ liệu đầu vào phải được kiểm tra bằng DTO.
- Thông tin mật phải được cấu hình bằng biến môi trường.

### 3.3.3. Khả năng bảo trì và mở rộng

- Mã nguồn được chia module theo nghiệp vụ.
- Frontend và backend được tách độc lập.
- Cơ sở dữ liệu sử dụng migration.
- Thiết kế cho phép bổ sung gợi ý sản phẩm và yêu cầu trao đổi.

### 3.3.4. Khả dụng

- Giao diện cần hoạt động trên các trình duyệt hiện đại.
- Thao tác chính phải có phản hồi và thông báo lỗi rõ ràng.
- Các trang yêu cầu đăng nhập phải chuyển hướng người dùng phù hợp.

## 3.4. Các ca sử dụng chính

| Mã | Ca sử dụng | Tác nhân |
| --- | --- | --- |
| UC01 | Đăng ký tài khoản | Khách |
| UC02 | Đăng nhập | Khách |
| UC03 | Xem và cập nhật hồ sơ | Người dùng |
| UC04 | Đăng sản phẩm | Người dùng |
| UC05 | Quản lý sản phẩm cá nhân | Người dùng |
| UC06 | Tìm kiếm và xem sản phẩm | Tất cả |
| UC07 | Nhắn tin | Người dùng |
| UC08 | Báo cáo vi phạm | Người dùng |
| UC09 | Quản lý người dùng | ADMIN |
| UC10 | Xử lý báo cáo | ADMIN |

## 3.5. Mô tả ca sử dụng đăng nhập

**Tác nhân:** Khách chưa đăng nhập.  
**Tiền điều kiện:** Tài khoản đã tồn tại và đang hoạt động.  
**Luồng chính:**

1. Người dùng nhập email và mật khẩu.
2. Frontend gửi dữ liệu tới `POST /api/auth/login`.
3. Backend tìm tài khoản theo email.
4. Backend dùng bcrypt đối chiếu mật khẩu.
5. Backend kiểm tra trạng thái tài khoản.
6. Backend tạo JWT và trả thông tin cơ bản của người dùng.
7. Frontend lưu phiên đăng nhập và chuyển tới giao diện chính.

**Luồng ngoại lệ:** Email hoặc mật khẩu sai; tài khoản không tồn tại; tài khoản đã bị khóa.

## 3.6. Mô tả ca sử dụng đăng sản phẩm

**Tác nhân:** Người dùng đã đăng nhập.  
**Tiền điều kiện:** JWT hợp lệ; danh mục tồn tại.  
**Luồng chính:**

1. Người dùng mở trang tạo sản phẩm.
2. Người dùng nhập thông tin, hình ảnh và vị trí.
3. Frontend gửi yêu cầu tới `POST /api/products`.
4. Backend kiểm tra token và dữ liệu DTO.
5. Backend tạo sản phẩm, hình ảnh và vị trí liên quan.
6. Hệ thống trả thông tin sản phẩm vừa tạo.

**Luồng ngoại lệ:** Token không hợp lệ; thiếu dữ liệu; danh mục không tồn tại; dữ liệu tọa độ sai.

# CHƯƠNG 4. THIẾT KẾ HỆ THỐNG

## 4.1. Kiến trúc tổng thể

```text
Người dùng
    │
    ▼
React SPA ── Axios/JSON/JWT ──► NestJS REST API
                                      │
                                      ▼
                              Prisma ORM / SQL
                                      │
                                      ▼
                              PostgreSQL + PostGIS
```

Frontend chịu trách nhiệm hiển thị và quản lý tương tác. Backend chịu trách nhiệm xác thực, phân quyền, kiểm tra dữ liệu và xử lý nghiệp vụ. PostgreSQL lưu dữ liệu bền vững; PostGIS xử lý dữ liệu không gian.

## 4.2. Thiết kế backend

Backend gồm các module:

| Module | Trách nhiệm |
| --- | --- |
| AuthModule | Đăng ký, đăng nhập và phát hành JWT |
| UsersModule | Hồ sơ và quản trị người dùng |
| CategoriesModule | Danh mục sản phẩm |
| ProductsModule | CRUD, trạng thái và tìm kiếm sản phẩm |
| MessagesModule | Tin nhắn và hội thoại |
| ReportsModule | Báo cáo và xử lý vi phạm |
| PrismaModule | Kết nối và truy cập cơ sở dữ liệu |

JWT guard được khai báo toàn cục. Thiết kế này giúp mặc định các endpoint được bảo vệ, giảm nguy cơ bỏ sót xác thực. Các route công khai như đăng nhập và danh sách sản phẩm sử dụng decorator `@Public()`.

## 4.3. Thiết kế frontend

Frontend được tổ chức thành:

- `api`: Axios client và các hàm gọi API.
- `components`: layout và thành phần bảo vệ route.
- `context`: trạng thái xác thực dùng chung.
- `pages`: các trang chức năng.
- `types`: kiểu dữ liệu TypeScript.
- `assets`: tài nguyên hình ảnh.

Các route chính gồm `/`, `/login`, `/register`, `/products`, `/products/:id`, `/products/new`, `/profile`, `/chat`, `/chat/:userId` và `/admin`.

## 4.4. Thiết kế cơ sở dữ liệu

### 4.4.1. Các thực thể cốt lõi

- **User:** lưu thông tin tài khoản, vai trò và trạng thái.
- **Category:** lưu danh mục sản phẩm.
- **Product:** lưu nội dung bài đăng và trạng thái giao dịch.
- **ProductImage:** lưu đường dẫn ảnh của sản phẩm.
- **Location:** lưu địa chỉ, tọa độ và điểm địa lý.
- **Message:** lưu tin nhắn giữa người gửi và người nhận.
- **Report:** lưu báo cáo vi phạm.

### 4.4.2. Các thực thể mở rộng

- **UserPreference:** sở thích tìm kiếm của người dùng.
- **UserBehavior:** hành vi xem, tìm kiếm hoặc lưu sản phẩm.
- **RecommendationHistory:** lịch sử đề xuất.
- **ExchangeRequest:** yêu cầu trao đổi giữa hai sản phẩm.

### 4.4.3. Quan hệ dữ liệu

```text
User 1 ───── N Product 1 ───── N ProductImage
                  │
                  ├───── 1 Location
                  │
Category 1 ──── N Product

User 1 ───── N Message N ───── 1 User
User 1 ───── N Report ───── 0..1 Product
User 1 ───── N Report ───── 0..1 User
```

Khi người dùng bị xóa, các sản phẩm và tin nhắn liên quan có thể được xóa theo cascade. Khi mục tiêu báo cáo bị xóa, khóa ngoại trong báo cáo được đặt về null để giữ lại lịch sử báo cáo.

## 4.5. Thiết kế xác thực và phân quyền

Quy trình xác thực:

1. Người dùng gửi thông tin đăng nhập.
2. Backend kiểm tra email và mật khẩu đã băm.
3. Backend tạo JWT chứa `sub`, `email` và `role`.
4. Frontend gửi JWT trong các request tiếp theo.
5. JWT guard xác minh token và gắn người dùng vào request.
6. Roles guard so sánh vai trò khi endpoint yêu cầu ADMIN.

## 4.6. Thiết kế API

| Nhóm | Phương thức và đường dẫn | Chức năng |
| --- | --- | --- |
| Auth | `POST /api/auth/register` | Đăng ký |
| Auth | `POST /api/auth/login` | Đăng nhập |
| Users | `GET /api/users/me` | Xem hồ sơ |
| Users | `PATCH /api/users/me` | Cập nhật hồ sơ |
| Users | `GET /api/users` | Danh sách người dùng cho admin |
| Products | `GET /api/products` | Danh sách và lọc sản phẩm |
| Products | `GET /api/products/search` | Tìm kiếm nâng cao/vị trí |
| Products | `POST /api/products` | Tạo sản phẩm |
| Products | `PATCH /api/products/:id` | Cập nhật sản phẩm |
| Products | `DELETE /api/products/:id` | Xóa sản phẩm |
| Messages | `GET /api/messages` | Danh sách hội thoại |
| Messages | `POST /api/messages` | Gửi tin nhắn |
| Reports | `POST /api/reports` | Tạo báo cáo |
| Reports | `PATCH /api/reports/:id/handle` | Admin xử lý báo cáo |

## 4.7. Thiết kế giao diện

Giao diện được thiết kế theo hướng SPA, trong đó layout chung chứa khu vực điều hướng và nội dung trang. Những trang chính gồm:

- Trang chủ giới thiệu và hiển thị sản phẩm nổi bật.
- Trang danh sách hỗ trợ tìm kiếm và lọc.
- Trang chi tiết hiển thị thông tin sản phẩm và chủ sở hữu.
- Trang tạo sản phẩm dành cho người dùng đã đăng nhập.
- Trang hồ sơ quản lý thông tin và sản phẩm cá nhân.
- Trang chat hiển thị hội thoại.
- Trang admin quản lý tài khoản và báo cáo.

# CHƯƠNG 5. CÀI ĐẶT, TRIỂN KHAI VÀ KẾT QUẢ

## 5.1. Môi trường phát triển

- Node.js 20.19 trở lên hoặc 22.12 trở lên.
- npm để quản lý package.
- PostgreSQL để lưu dữ liệu.
- PostGIS để hỗ trợ tìm kiếm không gian.
- Trình duyệt hiện đại để chạy frontend.

## 5.2. Cài đặt backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example` và cấu hình:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/gr1?schema=public"
JWT_SECRET="chuoi-bi-mat-an-toan"
JWT_EXPIRATION="7d"
PORT=3000
UPLOAD_DIR="uploads"
```

Khởi tạo dữ liệu và chạy ứng dụng:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

Backend hoạt động mặc định tại `http://localhost:3000`; Swagger tại `http://localhost:3000/api/docs`.

## 5.3. Cài đặt frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend hoạt động mặc định tại `http://localhost:5173`. Trong môi trường phát triển, Vite proxy các yêu cầu `/api` sang backend ở cổng 3000.

## 5.4. Dữ liệu mẫu

Dự án cung cấp seed data và ba tài khoản phục vụ phát triển:

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| ADMIN | `admin@secondhand.com` | `admin123` |
| PROVIDER | `provider@example.com` | `provider123` |
| SEEKER | `seeker@example.com` | `seeker123` |

Các tài khoản này chỉ được sử dụng trong môi trường phát triển và phải thay đổi hoặc loại bỏ khi triển khai thực tế.

## 5.5. Kết quả xây dựng chức năng

| Chức năng | Trạng thái |
| --- | --- |
| Đăng ký và đăng nhập | Đã xây dựng |
| Xác thực JWT | Đã xây dựng |
| Phân quyền quản trị | Đã xây dựng ở backend |
| Quản lý hồ sơ | Đã xây dựng |
| Quản lý sản phẩm | Đã xây dựng |
| Tìm kiếm và lọc | Đã xây dựng |
| Tìm kiếm theo vị trí | Đã xây dựng, cần kiểm thử thêm với dữ liệu thật |
| Nhắn tin | Đã xây dựng ở mức REST |
| Báo cáo vi phạm | Đã xây dựng |
| Quản trị người dùng | Đã xây dựng |
| Đề xuất cá nhân hóa | Mới có thiết kế dữ liệu |
| Luồng yêu cầu trao đổi | Mới có thiết kế dữ liệu |

## 5.6. Kết quả kiểm thử kỹ thuật

Việc kiểm tra được thực hiện trên mã nguồn tại ngày 19/07/2026.

| Nội dung | Kết quả | Nhận xét |
| --- | --- | --- |
| Build backend | Đạt | NestJS biên dịch thành công |
| Build frontend | Đạt | TypeScript và Vite biên dịch thành công |
| Unit test backend | Chưa đạt | Chưa có file unit test |
| E2E backend | Chưa đạt | Test mặc định cũ kiểm tra route không tồn tại |
| Test frontend | Chưa có | Chưa cấu hình test runner |
| ESLint backend | Chưa đạt | 65 lỗi và 4 cảnh báo |

Kích thước bundle frontend sau build khoảng 422,31 kB JavaScript, tương đương 127,97 kB sau gzip.

## 5.7. Đánh giá kết quả

Hệ thống đã thực hiện được các luồng cơ bản của nền tảng trao đổi đồ cũ. Cấu trúc mã nguồn rõ ràng, backend và frontend có thể biên dịch thành công, cơ sở dữ liệu bao quát các thực thể cốt lõi và có khả năng mở rộng.

Tuy vậy, kết quả build chưa đủ để chứng minh toàn bộ nghiệp vụ hoạt động chính xác. Dự án cần bổ sung unit test, integration test và E2E test. Các vấn đề lint cần được xử lý để tăng độ an toàn kiểu dữ liệu và tính nhất quán của mã nguồn.

# CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 6.1. Kết quả đạt được

Sau quá trình nghiên cứu và xây dựng, đồ án đã đạt được các kết quả chính:

- Xây dựng ứng dụng web theo kiến trúc client–server.
- Xây dựng giao diện SPA bằng React và TypeScript.
- Xây dựng REST API theo module bằng NestJS.
- Thiết kế cơ sở dữ liệu PostgreSQL bằng Prisma.
- Tích hợp PostGIS phục vụ tìm kiếm vị trí.
- Triển khai xác thực JWT và phân quyền quản trị.
- Hoàn thành các chức năng quản lý tài khoản, sản phẩm, tin nhắn và báo cáo.
- Tích hợp Swagger để mô tả và thử nghiệm API.
- Biên dịch thành công frontend và backend ở chế độ production build.

## 6.2. Hạn chế

- Chưa có bộ unit test và frontend test đầy đủ.
- E2E test hiện tại chưa phản ánh hệ thống thực tế.
- Mã backend còn lỗi lint và một số vị trí dùng `any`.
- Trang admin phía frontend cần kiểm tra vai trò rõ ràng hơn.
- JWT đang được lưu trong `localStorage`, chưa phải phương án tối ưu cho production.
- Chat chưa cập nhật theo thời gian thực.
- Chưa có thanh toán, vận chuyển và xác thực danh tính.
- Chức năng đề xuất và yêu cầu trao đổi chưa được hoàn thiện.
- Chưa có CI/CD, giám sát và quy trình sao lưu production.

## 6.3. Hướng phát triển

Trong thời gian tới, hệ thống có thể được phát triển theo các hướng:

1. Hoàn thiện kiểm thử tự động cho backend và frontend.
2. Xây dựng chat thời gian thực bằng WebSocket.
3. Hoàn thiện luồng yêu cầu trao đổi giữa hai sản phẩm.
4. Xây dựng hệ thống đề xuất dựa trên hành vi và sở thích.
5. Bổ sung lưu sản phẩm yêu thích và đánh giá uy tín người dùng.
6. Nâng cao bảo mật phiên đăng nhập, rate limiting và audit log.
7. Sử dụng soft delete cho sản phẩm vi phạm để có thể khôi phục.
8. Tích hợp lưu trữ ảnh trên dịch vụ đám mây.
9. Docker hóa hệ thống và xây dựng CI/CD.
10. Bổ sung theo dõi lỗi, logging, health check và sao lưu dữ liệu.

## 6.4. Kết luận

Đồ án “Xây dựng nền tảng trao đổi đồ cũ GR1” đã giải quyết được bài toán quản lý và kết nối người dùng có nhu cầu bán, trao đổi hoặc tặng sản phẩm đã qua sử dụng. Hệ thống đáp ứng phần lớn chức năng của một MVP và có kiến trúc phù hợp để tiếp tục mở rộng.

Thông qua quá trình thực hiện, sinh viên có cơ hội áp dụng kiến thức về phân tích yêu cầu, thiết kế cơ sở dữ liệu, xây dựng giao diện, phát triển REST API, xác thực, phân quyền và tích hợp các thành phần thành một hệ thống hoàn chỉnh. Đây là nền tảng quan trọng để tiếp tục hoàn thiện sản phẩm theo hướng an toàn, ổn định và có khả năng triển khai thực tế.

# TÀI LIỆU THAM KHẢO

[1] React Documentation, *React – The library for web and native user interfaces*.  
[2] NestJS Documentation, *A progressive Node.js framework*.  
[3] Prisma Documentation, *Next-generation Node.js and TypeScript ORM*.  
[4] PostgreSQL Global Development Group, *PostgreSQL Documentation*.  
[5] PostGIS Project, *PostGIS Documentation*.  
[6] Internet Engineering Task Force, *RFC 7519: JSON Web Token (JWT)*.  
[7] TypeScript Documentation, *TypeScript: JavaScript with syntax for types*.  
[8] Vite Documentation, *Next Generation Frontend Tooling*.

# PHỤ LỤC A. CẤU TRÚC THƯ MỤC

```text
GR1/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── common/
│   │   ├── messages/
│   │   ├── prisma/
│   │   ├── products/
│   │   ├── reports/
│   │   └── users/
│   └── test/
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── types/
└── README.md
```

# PHỤ LỤC B. KẾ HOẠCH KIỂM THỬ ĐỀ XUẤT

| Mã | Kịch bản | Kết quả mong đợi |
| --- | --- | --- |
| TC01 | Đăng ký với email mới | Tạo tài khoản và trả JWT |
| TC02 | Đăng ký với email đã tồn tại | Trả lỗi xung đột |
| TC03 | Đăng nhập đúng thông tin | Trả JWT và thông tin người dùng |
| TC04 | Đăng nhập sai mật khẩu | Trả lỗi 401 |
| TC05 | Tài khoản bị khóa đăng nhập | Trả lỗi 401 |
| TC06 | Khách xem danh sách sản phẩm | Trả danh sách phân trang |
| TC07 | Người dùng tạo sản phẩm hợp lệ | Tạo sản phẩm thành công |
| TC08 | Người khác sửa sản phẩm | Bị từ chối |
| TC09 | Tìm kiếm theo bán kính | Chỉ trả sản phẩm trong phạm vi |
| TC10 | Gửi và đọc tin nhắn | Tin nhắn được lưu và đánh dấu đọc |
| TC11 | Người dùng tạo báo cáo | Báo cáo có trạng thái PENDING |
| TC12 | Người thường gọi API admin | Trả lỗi 403 |
| TC13 | Admin khóa tài khoản | Trạng thái tài khoản thay đổi |
| TC14 | Admin xử lý báo cáo | Trạng thái báo cáo được cập nhật |

# PHỤ LỤC C. GỢI Ý HÌNH ẢNH CẦN BỔ SUNG

Để hoàn thiện bản nộp, cần chèn ảnh chụp hoặc sơ đồ tại các vị trí phù hợp:

1. Biểu đồ use case tổng quát.
2. Sơ đồ kiến trúc hệ thống.
3. Sơ đồ thực thể–liên kết của cơ sở dữ liệu.
4. Sequence diagram cho đăng nhập.
5. Sequence diagram cho đăng sản phẩm.
6. Giao diện trang chủ.
7. Giao diện danh sách và chi tiết sản phẩm.
8. Giao diện đăng sản phẩm.
9. Giao diện hồ sơ cá nhân.
10. Giao diện chat.
11. Giao diện quản trị.
12. Ảnh kết quả Swagger và kết quả build/test.
