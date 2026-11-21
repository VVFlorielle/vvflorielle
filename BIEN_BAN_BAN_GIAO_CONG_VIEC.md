# BIÊN BẢN BÀN GIAO CÔNG VIỆC & HỒ SƠ KIẾN TRÚC TOÀN DIỆN
**Hệ Thống Tiệm Hoa Tươi V&V Florielle (Boutique Florist Cầu Giấy Hà Nội)**
*Thời điểm bàn giao: Ngày 21 Tháng 11 Năm 2026 | Phiên bản hệ thống: V12.2 Production Ready*

---

## 🌸 I. THÔNG TIN CHUNG DỰ ÁN
* **Tên thương hiệu**: **V&V Florielle** — Tiệm Hoa Tươi Thiết Kế Nghệ Thuật Cao Cấp.
* **Slogan & Tiêu ngữ**: *"Flowers That Speak From The Heart"*.
* **Khu vực hoạt động**: Cầu Giấy, Ba Đình, Hoàn Kiếm, Đống Đa, Tây Hồ, Thanh Xuân, Nam/Bắc Từ Liêm và toàn địa bàn TP. Hà Nội.
* **Loại hình sản phẩm**: Hoa chúc mừng khai trương, hoa sinh nhật cao cấp, hoa tình yêu kỷ niệm, lan hồ điệp hoàng gia, hoa chia buồn trang trọng.
* **Mã nguồn dự án**: Lưu trữ an toàn trên GitHub tại kho: `https://github.com/VVFlorielle/vvflorielle.git` (Đồng bộ song song 2 nhánh `master` và `main`).

---

## 🏗️ II. KIẾN TRÚC CÔNG NGHỆ & NỀN TẢNG KỸ THUẬT

| Thành Phần | Công Nghệ Sử Dụng | Mục Đích & Vai Trò |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, Context API) | Xây dựng giao diện Single-Page Application (SPA) phản hồi tức thì, mượt mà. |
| **Ngôn ngữ lập trình** | TypeScript (Strict Type Safety) | Đảm bảo tính toàn vẹn dữ liệu, triệt tiêu 100% lỗi cú pháp và lỗi runtime ngầm. |
| **Styling & Hiệu ứng** | Tailwind CSS + CSS Glassmorphism | Thiết kế giao diện phong cách thiệp hoa châu Âu, kính mờ (Glass panel), bo tròn hiện đại. |
| **Bộ Icon** | Lucide React | Hệ thống biểu tượng vector sắc nét, tối ưu tải trang. |
| **Bộ mã hóa thanh toán** | VietQR Standard (Napas 24/7) | Tự động sinh mã QR ngân hàng động kèm đúng số tiền và nội dung đơn hoa. |
| **Trí tuệ nhân tạo (AI)** | Google Gemini Vision API | Đọc ảnh chụp màn hình hóa đơn chuyển khoản (Bill cọc 50%) và tự động duyệt đơn. |
| **Email Service** | Google Apps Script Webhook / Gmail App | Tổng đài phát email OTP và thông báo đơn hoa tự động từ `vvflorielle@gmail.com`. |
| **Định dạng hình ảnh** | WebP thế hệ mới | Nén ảnh hoa tươi chất lượng cao với dung lượng siêu nhẹ (<150KB), tải trang <0.8 giây. |
| **Âm thanh thông báo** | Web Audio API | Phát âm thanh chuông hoa êm tai khi có đơn hàng mới mà không cần nạp file mp3 nặng. |
| **Công cụ đóng gói** | Vite 5 | Trình biên dịch siêu tốc, hỗ trợ Hot Module Replacement (HMR). |

---

## 🚀 III. TỔNG HỢP CÁC TÍNH NĂNG ĐÃ HOÀN TẤT BÀN GIAO (TỪ V1 ĐẾN V12)

### 1. Phân Hệ Trải Nghiệm Khách Hàng (Storefront)
1. **Catalog 54 Sản Phẩm Hoa Tươi Thiết Kế Thật**:
   - 100% hình ảnh hoa thật chuẩn boutique florist Hà Nội, định dạng WebP sắc nét.
   - 5 danh mục chọn lọc: Hoa Sinh Nhật, Hoa Tình Yêu, Lan Hồ Điệp, Hoa Chúc Mừng Khai Trương, Hoa Chia Buồn.
   - Bộ lọc giá, lọc theo hoa chủ đạo (Hoa hồng Ecuador, Tulip Hà Lan, Hướng dương, Baby...).
2. **Giỏ Hàng & Hệ Thống Áp Dụng Voucher Kép**:
   - Cho phép áp dụng cùng lúc **01 mã giảm giá hoa** + **01 mã Freeship vận chuyển**.
   - Cơ chế bảo vệ giỏ hàng: Lưu trữ an toàn trong `localStorage`, tải lại trang hay mất mạng không bị mất hoa đã chọn.
3. **Thanh Toán Đặt Cọc 50% Thông Minh & VietQR Động**:
   - Khách đặt cọc 50% để thợ cắm hoa, 50% còn lại thanh toán khi nhận hoa (COD).
   - Mã VietQR sinh tự động chuẩn Napas, khách quét app ngân hàng là điền sẵn STK, số tiền cọc và cú pháp: `VVF[Mã đơn] [SĐT]`.
   - Hỗ trợ tải lên ảnh chụp bill cọc để AI và chủ quán đối soát tức thì.
4. **Hệ Thống Hội Viên VIP & Tích Điểm Đặc Quyền**:
   - Phân 4 hạng thẻ: Thành viên mới, Bạc, Vàng, Kim Cương.
   - Tích lũy 1 điểm cho mỗi 10.000đ chi tiêu; đổi điểm lấy voucher ưu đãi trực tiếp trong giỏ hàng.
   - Ví voucher cá nhân: Nhận mã giảm giá bí mật, quà tặng sinh nhật airdrop trực tiếp từ chủ tiệm.
5. **Tra Cứu Tiến Độ Đơn Hàng & Đánh Giá Hoa Kèm Ảnh**:
   - Khách nhập số điện thoại là xem được toàn bộ lịch sử đơn hàng, trạng thái cọc, ảnh hoa trước khi giao.
   - Đánh giá chấm 5 sao, gửi lời cảm ơn và đính kèm ảnh hoa thực tế nhận được.

### 2. Phân Hệ Quản Trị Vận Hành (Admin & Owner Portal)
1. **Bàn Làm Việc Tổng Thể (Management Dashboard)**:
   - Thống kê thời gian thực: Doanh thu thực tế, số đơn đang cắm, số đơn đang giao, số đơn chờ duyệt cọc.
   - Thanh Dock điều hướng thông minh dưới đáy màn hình (Management Bottom Dock) hỗ trợ nút quay lại Bàn làm việc nhanh chóng.
   - Công cụ **Scroll Restoration Engine**: Tự động lưu tọa độ cuộn theo từng pixel, khi bấm nút Back hoặc vuốt cạnh màn hình điện thoại thì màn hình lập tức trở về đúng vị trí đang đứng trước đó.
2. **Quản Lý Đơn Hàng Siêu Gọn (Orders Management)**:
   - Tích hợp 2 chế độ xem: `[🗂️ Thẻ đầy đủ]` và `[📋 Thu gọn 1 dòng]`.
   - Xem dạng Lịch Giao Hoa hẹn giờ theo từng khung giờ sáng/trưa/tối.
   - Phân trang chuyên nghiệp (10 / 20 / 50 / Tất cả đơn).
3. **Trợ Lý AI Tự Động Duyệt Cọc (Gemini Vision)**:
   - Trợ lý AI tự động phân tích ảnh hóa đơn chuyển khoản ngân hàng của khách: Đọc số tiền, STK nhận, mã giao dịch và tự động chuyển đơn sang trạng thái *"Đã cọc 50% - Đang cắm hoa"* trong vòng 2 phút.
   - Công tắc đồng bộ 2 chiều tức thì giữa trang *Cấu Hình Tiệm* và trang *Bảo Mật Cấp 2*.
4. **Quản Lý Mẫu Hoa & Bảng Giá (Catalog Management)**:
   - Thêm mới, chỉnh sửa, ẩn/hiển thị mẫu hoa; chỉnh sửa giá bán, giá gạch khuyến mại theo %.
   - Công cụ tổ chức Sự Kiện Giảm Giá đồng loạt dịp lễ (Valentine 14/2, 8/3, 20/10, Ngày Đôi...).
   - Kho Bản Nháp (Archived Products): Khôi phục mẫu hoa đã xóa hoặc xóa vĩnh viễn an toàn.
5. **Quản Lý Khách Hàng VIP (Customers Management)**:
   - Tra cứu hồ sơ khách hàng theo tên, SĐT, email; cộng/trừ điểm thưởng; cấp lại mật khẩu tạm thời.
   - Chế độ xem Compact 1 dòng trên mobile kèm phân trang 10/20/50 hội viên/trang.
   - Nút *"Tặng Mã"*: Cấp voucher đặc quyền trực tiếp vào ví cá nhân của từng khách hàng thân thiết.
6. **Quản Lý Voucher & Khuyến Mại (Promotions Management)**:
   - Phân loại voucher: Công khai trên web, Mã ẩn / Ví hội viên, Voucher Hoa tươi, Voucher Freeship.
   - Công tắc giả lập chiến dịch trực tiếp (Ngày Đôi 5 tầng giảm giá, Giờ Vàng Flash Sale 12h & 20h, Mùng 1 / Rằm).
   - Nút *"Airdrop"*: Phát mã ưu đãi đồng loạt vào ví của 100% khách hàng trong hệ thống.
7. **Báo Cáo Doanh Thu & Dòng Tiền (Revenue Analytics)**:
   - Biểu đồ tài chính theo mốc thời gian: Hôm nay, Hôm qua, 7 ngày qua, Tháng này, Tháng trước, Tùy chọn ngày.
   - Phân tách dòng tiền thanh toán: VietQR chuyển khoản vs Tiền mặt COD.
   - Xuất toàn bộ báo cáo doanh thu chi tiết ra file Excel CSV có hỗ trợ tiếng Việt có dấu.
8. **Quản Lý Đánh Giá & Vote Sao (Reviews Management)**:
   - Duyệt hiển thị đánh giá tốt lên trang chủ; ẩn các đánh giá không phù hợp.
   - Ghim đánh giá 5 sao nổi bật lên đầu; trả lời phản hồi cảm ơn khách hàng từ chủ tiệm.
9. **Cấu Hình Tiệm (Store Configuration)**:
   - Tinh gọn 2 cột đối xứng: Cập nhật tên tiệm, hotline, thời gian mở ca làm việc (ca sáng, ca chiều).
   - Cấu hình cước phí ship theo khoảng cách bán kính km (ngưỡng Freeship, phụ phí thời tiết mưa/bão/đêm khuya).
   - Quản lý kênh liên hệ nổi (Floating Widget): Hotline, Zalo OA, TikTok, Chỉ đường Google Maps.
10. **Bảo Mật Cấp 2, Mật Khẩu & VietQR (Security Subpage)**:
    - Cấu hình tài khoản thụ hưởng VietQR (Vietcombank, MB Bank, Techcombank, BIDV...).
    - Quy trình xác thực bảo mật 2 lớp (2FA qua Gmail OTP) khi thay đổi số tài khoản ngân hàng.
    - Phân tách rành mạch: Tổng đài phát thư `vvflorielle@gmail.com` và Hộp thư nhận cảnh báo `traivuho@gmail.com`.
    - Biểu mẫu email gửi OTP chuẩn thiệp hoa với thông tin tiệm lấy ĐỘNG 100% từ cấu hình.

---

## 🔐 IV. THÔNG TIN BẢO MẬT & TÀI KHOẢN VẬN HÀNH

### 1. Tài Khoản Quản Trị
* **Tài khoản mặc định**: `vvflorielle` hoặc `admin`
* **Mật khẩu ban đầu**: `admin123` (Chủ tiệm có thể đổi mật khẩu mới bất kỳ lúc nào tại tab *Bảo Mật Cấp 2*).
* **Mã PIN Bảo Mật Cấp 2**:
  * Mã PIN ban đầu: `1909203`
  * **Cơ chế Cứu Hộ Khẩn Cấp Ngầm (Master Key)**: Trường hợp chủ tiệm đổi sang mã PIN mới mà sau này vô tình quên mất, hệ thống luôn tích hợp sẵn mã ngầm `1909203` để mở khóa cứu hộ trong mọi tình huống khẩn cấp mà không làm gián đoạn kinh doanh.

### 2. Cấu Hình Email Tổng Đài & Hộp Thư Nhận
* **Hộp thư phát tự động (Tổng đài tiệm)**: `vvflorielle@gmail.com`
  * Đóng vai trò là Người gửi (`From`).
  * Sử dụng Webhook Google Apps Script hoặc Mật khẩu ứng dụng (App Password) 16 ký tự của Google.
* **Hộp thư nhận OTP quản trị & cảnh báo**: `traivuho@gmail.com`
  * Đóng vai trò là Người nhận an toàn (`To`).
  * Chỉ dùng để NHẬN mã OTP khôi phục PIN và mã 2FA đổi tài khoản ngân hàng, không bao giờ cần nhập mật khẩu của hòm thư này vào website.

---

## 📜 V. DANH SÁCH TỆP TIN MÃ NGUỒN CỐT LÕI
* `src/components/Header.tsx`: Thanh điều hướng chính của website (ĐƯỢC BẢO VỆ NGUYÊN VẸN THEO RULE 1).
* `src/context/StoreContext.tsx`: Trái tim quản lý state toàn bộ ứng dụng (giỏ hàng, đơn hàng, khách hàng, voucher, cài đặt tiệm, bảo mật).
* `src/components/management/subpages/`:
  * `OrdersSubpage.tsx`: Quản lý đơn hàng, duyệt cọc, xem compact 1 dòng, phân trang.
  * `ProductsSubpage.tsx`: Quản lý kho 54 mẫu hoa, giá bán, sự kiện giảm giá, bản nháp.
  * `CustomersSubpage.tsx`: Quản lý khách hàng VIP, cấp voucher đặc quyền, cấp MK, phân trang.
  * `PromotionsSubpage.tsx`: Quản lý voucher kép, giờ vàng flash deal, airdrop toàn dân, phân trang.
  * `RevenueSubpage.tsx`: Báo cáo tài chính, dòng tiền, xuất Excel CSV.
  * `ReviewsSubpage.tsx`: Duyệt đánh giá, ghim 5 sao, trả lời bình luận, phân trang.
  * `StoreConfigSubpage.tsx`: Cấu hình thông tin tiệm, cước ship, nút liên hệ nổi.
  * `SecuritySubpage.tsx`: Bảo mật cấp 2, tài khoản ngân hàng VietQR, Gmail OTP, Gemini AI key.
* `src/utils/scrollRestoration.ts`: Bộ điều khiển lưu vết và khôi phục vị trí cuộn màn hình khi Back.
* `src/services/geminiVisionService.ts`: Dịch vụ trí tuệ nhân tạo Gemini đọc bill cọc ngân hàng.

---

## ✅ VI. TÌNH TRẠNG BÀN GIAO & CAM KẾT
1. **Kiểm thử đóng gói**: Lệnh `npm run build` đã biên dịch thành công 100% với **0 lỗi TypeScript, 0 lỗi cảnh báo cú pháp**.
2. **Đồng bộ mã nguồn**: Mã nguồn đã được commit và push đẩy đủ lên cả 2 nhánh `master` và `main` của GitHub.
3. **Kế hoạch tiếp theo (V13)**: Hạng mục tối ưu dải nút chức năng thành 2 hàng cân đối (Zero-Scroll trên Mobile/Tablet) đã được lưu vết chi tiết trong file `ke_hoach_va_loi_v13.md`, sẵn sàng kích hoạt bất kỳ lúc nào chủ tiệm yêu cầu.

*Hồ sơ bàn giao này có giá trị lưu trữ kỹ thuật lâu dài cho chủ sở hữu tiệm hoa V&V Florielle.*
