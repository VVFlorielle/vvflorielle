# KẾ HOẠCH VÁ LỖI & TỐI ƯU HÓA GIAO DIỆN V13
**Hệ Thống Tiệm Hoa Tươi V&V Florielle**
*Ngày lập: 21/11/2026 | Phiên bản kế hoạch: V13 (Đầy Đủ Bao Gồm Đồng Bộ URL & Zero-Scroll 2 Hàng)*

---

## 📌 TỔNG QUAN YÊU CẦU & BỐI CẢNH
Sau khi hoàn tất thành công 100% **Kế hoạch V12** và rà soát thực tế toàn diện trang web, hệ thống ghi nhận 2 nhóm nhiệm vụ nâng cấp lớn:

1. **Tối ưu hóa hàng nút chức năng Mobile & Tablet (Zero-Scroll 2 Hàng):**
   * Các dải nút chức năng (lọc tiến độ đơn hàng, lọc cọc VietQR, lọc voucher, lọc đánh giá, lọc danh mục mẫu hoa, phân khu dashboard) đang bị ép cứng trên 1 hàng ngang kèm thanh cuộn (`overflow-x-auto`).
   * **Mục tiêu:** Chuyển đổi thành **2 hàng cân đối** hoặc **lưới Grid thông minh (2x2, 2x3)** để hiển thị 100% nút trực quan ngay khi mở trang, không phải dùng ngón tay vuốt ngang.
2. **Đồng bộ hóa đường dẫn URL thông minh (Smart URL Router & Deep Linking):**
   * Hiện tại khi bấm xem *Liên Hệ*, *Mẫu Hoa*, *Giới Thiệu*, *Cẩm Nang*, thanh địa chỉ trình duyệt vẫn giữ nguyên `vvflorielle.pages.dev` mà không đổi sang `/lien-he`, `/mau-hoa`, `/gioi-thieu`... dẫn đến việc bấm F5 bị văng về Trang chủ, không dùng được phím Back (←) và không copy link gửi cho người khác được.
   * **Mục tiêu:** Đồng bộ hóa đường dẫn mượt mà không tải lại trang, F5 giữ nguyên trang đang xem, dùng được nút Back/Forward, chia sẻ link chuẩn xác.

---

## 🛡️ ĐÁNH GIÁ ẢNH HƯỞNG ĐẾN CODE & VẬN HÀNH WEBSITE

| Tiêu chí | Mức độ ảnh hưởng | Giải thích chi tiết |
| :--- | :---: | :--- |
| **Tính toàn vẹn của Header** | **0% ảnh hưởng (Tuyệt đối an toàn)** | Tuân thủ nghiêm ngặt **RULE 1**: File `src/components/Header.tsx` được giữ nguyên vẹn 100%, không sửa bất kỳ dòng nào. Header gọi hàm `setCurrentView(...)` có sẵn, và hàm này sẽ tự động cập nhật URL dưới nền. |
| **Dữ liệu kinh doanh & Mẫu hoa** | **0% ảnh hưởng (Bảo toàn 100%)** | Toàn bộ 54 mẫu hoa tươi, giỏ hàng, thông tin khách hàng, đơn hàng, cấu hình ngân hàng VietQR, mã OTP, tính điểm thưởng... hoàn toàn giữ nguyên vẹn. |
| **Tốc độ lướt web (Trải nghiệm SPA)** | **Giữ nguyên siêu nhanh (0.1s)** | Sử dụng HTML5 History API (`window.history.pushState` & `popstate`), trang web đổi trang tức thì, không bị chớp hay tải lại trang. |
| **Máy chủ Cloudflare Pages** | **Hoạt động trơn tru 100%** | Thêm một dòng định tuyến SPA trong `public/_redirects`: `/* /index.html 200` để khách hàng bấm F5 hoặc gán link trực tiếp không bao giờ bị lỗi 404. |
| **Đường link cũ `vvflorielle.pages.dev`** | **Tương thích ngược 100%** | Ai vào link cũ vẫn mở Trang chủ bình thường như trước đây. |

---

## 🎯 CHI TIẾT CÁC HẠNG MỤC NÂNG CẤP TRONG V13

### HẠNG MỤC 1: ĐỒNG BỘ ĐƯỜNG DẪN URL THÔNG MINH & DEEP LINKING TỪNG SẢN PHẨM
* **Tệp tin xử lý:** `src/context/StoreContext.tsx`, `src/components/ProductDetailModal.tsx`, `public/_redirects`, `src/App.tsx`, `src/pages/AdminPortal.tsx`, `src/pages/OwnerPortal.tsx`
* **Nội dung hoàn tất:**
  1. Quy tắc điều hướng SPA trong `public/_redirects`: `/* /index.html 200` để Cloudflare Pages luôn phục vụ trang web cho mọi đường dẫn con khi gõ trực tiếp hoặc bấm F5.
  2. Tại `StoreContext.tsx`:
     * Đọc và khôi phục trạng thái chuẩn xác ngay khi mở trang (Initial URL Router):
       * `/` ➔ Trang chủ (`store`)
       * `/mau-hoa` ➔ Danh mục mẫu hoa (`catalog`)
       * `/danh-muc/:catId` ➔ Mở ngay bộ sưu tập theo chủ đề (ví dụ `/danh-muc/khai-truong`, `/danh-muc/sinh-nhat`, `/danh-muc/tinh-yeu`...)
       * `/san-pham/:id` ➔ Mở thẳng popup chi tiết mẫu hoa đó (`selectedProduct`), tiện gửi link tư vấn qua Zalo / Facebook / Messenger
       * `/gioi-thieu` ➔ Giới thiệu tiệm hoa (`about`)
       * `/lien-he` ➔ Liên hệ & Ghé tiệm (`contact`)
       * `/cam-nang` ➔ Cẩm nang chăm sóc hoa (`care`)
       * `/hoi-vien` ➔ Cổng hội viên tra cứu đơn (`customer`)
       * `/gio-hang` ➔ Mở ngăn kéo giỏ hàng (`isCartOpen`)
       * `/admin` hoặc `/admin/:tab` ➔ Trang quản trị hệ thống (`admin`) với tab con tương ứng (`orders`, `products`, `revenue`, `promotions`...)
       * `/owner` hoặc `/owner/:tab` ➔ Trang chủ tiệm hoa (`owner`)
     * Lắng nghe sự kiện `popstate` hai chiều: Khi bấm phím Mũi tên Back/Forward (← / →) trên trình duyệt hoặc vuốt cạnh màn hình điện thoại, tự động quay lại trang trước, đóng mở modal hoa hoặc giỏ hàng cực kỳ mượt mà.
     * Cập nhật `document.title` tương ứng theo từng trang và từng mẫu hoa.
  3. Tại `ProductDetailModal.tsx`:
     * Nút "Sao chép link", "Chia sẻ Zalo", "Chia sẻ Facebook" xuất ra đường dẫn sạch: `https://vvflorielle.pages.dev/san-pham/:id`.

---

### HẠNG MỤC 2: QUẢN LÝ ĐƠN HÀNG (`OrdersSubpage.tsx`)
* **Nút lọc 7 trạng thái tiến độ đơn:** Chuyển đổi thành **2 hàng cân đối (Lưới 2-4 cột)**:
  * Hàng 1 (4 nút tiếp nhận): `Tất cả` | `Chờ duyệt kho` | `Chờ cọc 50%` | `Đang cắm`.
  * Hàng 2 (3 nút kết quả): `Đang giao` | `Hoàn thành` | `Đã hủy`.
* **Nút lọc cọc 50%:** Bố trí 2 hàng dạng `flex-wrap gap-1.5` rút gọn nhãn: `Tất cả cọc` | `⏳ Chờ duyệt cọc` | `✓ Đã duyệt cọc` | `⚠️ Cọc bị từ chối`.
* **Không còn thanh cuộn ngang `overflow-x-auto`**, hiển thị đầy đủ 100% nút trên mọi kích thước màn hình điện thoại và tablet.

---

### HẠNG MỤC 3: QUẢN LÝ VOUCHER & KHUYẾN MÃI (`PromotionsSubpage.tsx`)
* **Thanh tab 5 loại voucher:** Chuyển từ cuộn ngang thành **Lưới 2-3 cột trên Mobile (2 hàng)**:
  * Hàng 1 (Phạm vi hiển thị): `Tất cả` | `👁️ Công khai` | `🔒 Mã ẩn / SN`.
  * Hàng 2 (Loại giảm giá): `🌸 Hoa Tươi` | `🚚 Vận Chuyển`.

---

### HẠNG MỤC 4: QUẢN LÝ ĐÁNH GIÁ (`ReviewsSubpage.tsx`)
* **4 tab trạng thái đánh giá:** Chuyển từ 1 hàng cuộn ngang thành **Lưới 2x2 cân xứng** trên Mobile:
  * Hàng 1: `Tất cả ({total})` + `🕒 Chờ duyệt ({pending})`.
  * Hàng 2: `✓ Đang hiển thị ({approved})` + `👁️‍🗨️ Đã ẩn ({hidden})`.

---

### HẠNG MỤC 5: BÀN LÀM VIỆC TỔNG QUAN (`ManagementFunctionalGrid.tsx`)
* **Thanh lọc phân khu trên Mobile:** Chuyển từ 1 hàng cuộn ngang thành **Lưới 3 cột (2 hàng 6 nút)**, bấm là vào ngay không cần vuốt.

---

### HẠNG MỤC 6: QUẢN LÝ KHÁCH HÀNG & HỘI VIÊN (`CustomersSubpage.tsx`)
* **Bộ lọc Hạng VIP & Trạng thái an ninh:** Lưới 3 cột (Hạng VIP) và Lưới 2 cột (Trạng thái hoạt động / khóa / ẩn danh NĐ13), căn chỉnh thẳng hàng 2 hàng sạch sẽ, không bị rớt dòng so le.

---

### HẠNG MỤC 7: BÁO CÁO DOANH THU & TÀI CHÍNH (`RevenueSubpage.tsx`)
* **Mốc thời gian nhanh & Lọc thanh toán:** Tách thành Lưới 2x3 cho mốc thời gian (*Hôm nay, Hôm qua, 7 ngày, Tháng này...*) và lưới 3 cột cho phương thức (*Tất cả, VietQR, Tiền mặt/COD*).

---

### HẠNG MỤC 8: BỘ SƯU TẬP HOA NGOÀI WEB (`CatalogPage.tsx`)
* **Thanh chọn danh mục hoa:** Bỏ cuộn ngang `overflow-x-auto`, chuyển thành **2 hàng viên thuốc Pill tabs `flex-wrap`** tự co giãn mềm mại như trên Trang chủ.

---

### HẠNG MỤC 9: CỔNG HỘI VIÊN & TRA CỨU ĐƠN (`CustomerOrdersTab.tsx`)
* **6 tab hành trình đơn hàng:** Chuyển từ cuộn ngang thành **Lưới 2x3 nút bấm** để khách hàng kiểm tra đơn hoa thuận tiện trên điện thoại.

---

### HẠNG MỤC 10: LỌC SAO ĐÁNH GIÁ TRANG CHỦ (`CustomerReviewsSection.tsx`)
* **Các nút lọc số sao (Tất cả, 5 sao, 4 sao, 3 sao...):** Bỏ cuộn ngang, chuyển thành `flex-wrap` 2 hàng ở giữa màn hình.

---

## 📋 MA TRẬN TIẾN ĐỘ THI CÔNG V13

| STT | Phân Hệ / Tệp Tin | Nội Dung Triển Khai | Trạng Thái |
| :---: | :--- | :--- | :---: |
| **1** | `public/_redirects` & `StoreContext.tsx` | Kích hoạt Smart URL Router (`/lien-he`, `/mau-hoa`, `/san-pham/:id`, `/danh-muc/:catId`, `/admin/:tab`...), hỗ trợ F5 & nút Back | ✅ ĐÃ HOÀN TẤT |
| **2** | `ProductDetailModal.tsx` | Cập nhật link chia sẻ sản phẩm sang dạng chuẩn `/san-pham/:id` | ✅ ĐÃ HOÀN TẤT |
| **3** | `OrdersSubpage.tsx` | 2 hàng nút tiến độ (4 trên, 3 dưới) + 2 hàng nút cọc VietQR + Search/CSV | ✅ ĐÃ HOÀN TẤT |
| **4** | `PromotionsSubpage.tsx` | 2 hàng tab voucher (Lưới 2-3 cột trên Mobile) | ✅ ĐÃ HOÀN TẤT |
| **5** | `ReviewsSubpage.tsx` | Lưới 2x2 nút trạng thái đánh giá (Tất cả, Chờ duyệt / Đang hiển thị, Đã ẩn) | ✅ ĐÃ HOÀN TẤT |
| **6** | `ManagementFunctionalGrid.tsx` | 2 hàng nút phân khu trên Mobile (Lưới 3 cột x 2 hàng) | ✅ ĐÃ HOÀN TẤT |
| **7** | `CustomersSubpage.tsx` | Căn chỉnh thẳng hàng 2 dải nút Hạng VIP (3 cột) và Trạng thái (2 cột) | ✅ ĐÃ HOÀN TẤT |
| **8** | `RevenueSubpage.tsx` | Lưới 2x3 mốc thời gian nhanh + Dải nút thanh toán VietQR/COD | ✅ ĐÃ HOÀN TẤT |
| **9** | `CatalogPage.tsx` | 2 hàng Pill tabs danh mục hoa ngoài web, không cuộn ngang | ✅ ĐÃ HOÀN TẤT |
| **10** | `CustomerOrdersTab.tsx` | Lưới 2x3 nút tiến độ đơn hàng trong cổng hội viên | ✅ ĐÃ HOÀN TẤT |
| **11** | `CustomerReviewsSection.tsx` | Dải nút lọc sao chuyển thành 2 hàng flex-wrap | ✅ ĐÃ HOÀN TẤT |
| **12** | `App.tsx`, `AdminPortal.tsx`, `OwnerPortal.tsx` | Đồng bộ Popstate và Scroll Restoration theo URL | ✅ ĐÃ HOÀN TẤT |
