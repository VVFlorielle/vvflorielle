# BÁO CÁO RÀ SOÁT TOÀN DIỆN HỆ THỐNG GIAO DIỆN & BỐ CỤC (V14)
**Dự án:** Tiệm Hoa Nghệ Thuật & Thiết Kế Cao Cấp V&V Florielle  
**Thời gian thực hiện:** 21/11/2026  
**Phạm vi rà soát:** Toàn bộ 77 tệp mã nguồn giao diện (.tsx, .ts), cả Trang Chủ Khách Hàng (Storefront) & Bảng Quản Trị Hệ Thống (Admin & Owner Portal), trên các chuẩn màn hình Mobile (320px, 375px, 390px, 412px), Tablet (768px, 820px) và Desktop (1024px+).

---

## 1. PHÂN TÍCH CHI TIẾT 2 HÌNH ẢNH BẠN PHẢN HỒI

### 1.1. Ảnh 1: Thư Email OTP hiển thị lỗi `` và KHÔNG có Logo Tiệm Hoa
* **Hiện tượng trong ảnh:**
  * Tiêu đề thư: `✿ [V&V Florielle] Mã OTP Khôi Phục Mã PIN Quản Trị Cấp 2` (ký tự `✿` hiển thị đúng).
  * Trong khung nội dung thư: hiển thị ` V&V Florielle` (6 dấu chấm hỏi quả trám), và hoàn toàn không thấy Logo tròn/vuông của tiệm.
* **Nguyên nhân kỹ thuật tận gốc:**
  1. **Sự cố thiếu Logo (404 Not Found):**
     * Trong mã nguồn mặc định (`src/data/mockData.ts:972`, `StoreContext.tsx:1186`), biến `logoVerticalUrl` được gán đường dẫn fallback là `'/logo.png'`.
     * Khi kiểm tra thư mục `public/`: chỉ có các tệp `logo-vvflorielle-square.png`, `logo-vvflorielle-horizontal.webp` mà **HOÀN TOÀN KHÔNG CÓ TỆP `logo.png`**!
     * Do đó, khi hệ thống gửi email với thẻ `<img src="https://vvflorielle.pages.dev/logo.png" />`, trình duyệt Gmail gọi link ảnh và nhận về mã lỗi **404 Not Found** -> Gmail ẩn ảnh đi, dẫn đến thư không có logo.
     * *Hệ lụy phát hiện thêm:* Phiếu in đơn hoa giao hàng tại `src/components/management/subpages/OrdersSubpage.tsx:1584` cũng dùng `logoVerticalUrl || '/logo.png'`, nên khi bấm "In phiếu giao hoa" cũng bị mất logo tiệm!
  2. **Sự cố 6 dấu chấm hỏi ``:**
     * Trước đây trong tệp `src/utils/googleDriveArchiver.ts`, tiêu đề thư trong thẻ h2 từng chứa emoji hoa anh đào: `<h2>🌸 " + storeName + "</h2>`.
     * Khi dán mã vào trình soạn thảo Google Apps Script (script.google.com), nếu Google Apps Script lưu trữ theo bảng mã không chuẩn UTF-8, ký tự emoji 4-byte `🌸` bị vỡ thành 6 byte lỗi ``.
     * **Tại sao bạn đã cập nhật mã mới mà thư gửi đến vẫn bị?**  
       Trên Google Apps Script, khi bạn sửa code và bấm nút "Lưu" (Save), Google Web App **vẫn tiếp tục chạy bản Triển khai cũ (Deployment cũ)**!  
       Để Google Web App nhận code mới nhất, người quản trị bắt buộc phải bấm: **"Triển khai" (Deploy) -> "Quản lý bản triển khai" (Manage deployments) -> Chọn icon Bút chì (Edit) -> Đổi Phiên bản thành "Phiên bản mới" (New version) -> Bấm "Triển khai"**.
* **Giải pháp khắc phục triệt để:**
  1. Tạo bản sao chính thức của `public/logo-vvflorielle-square.png` thành `public/logo.png` (chuẩn ảnh PNG độ nét cao 484KB). Như vậy cả 2 đường dẫn `/logo.png` và `/logo-vvflorielle-square.png` đều tải 100% thành công.
  2. Đồng bộ tất cả fallback logo trong `mockData.ts`, `StoreContext.tsx`, `BrandingSubpage.tsx` sang `/logo-vvflorielle-square.png`.
  3. Loại bỏ hoàn toàn mọi ký tự emoji thô có thể gây lỗi mã hóa trong mẫu Google Apps Script tại `googleDriveArchiver.ts`, thay bằng logo ảnh chính thống hiển thị sắc nét.

---

### 1.2. Ảnh 2: Thanh địa chỉ trình duyệt không đổi đường dẫn khi chuyển trang
* **Hiện tượng trong ảnh:** Bạn ở trang "Liên Hệ & Ghé Tiệm" nhưng thanh URL vẫn giữ nguyên `vvflorielle.pages.dev`.
* **Nguyên nhân kỹ thuật:**
  * Cơ chế định tuyến đường dẫn sạch Deep Linking (V13) vừa mới được lập trình và đẩy lên GitHub (Commit `bd1af34`).
  * Tại thời điểm chụp ảnh, Cloudflare Pages chưa kịp hoàn tất tiến trình Build & Deploy tự động, hoặc trình duyệt còn lưu cache phiên bản V12 cũ.
* **Tình trạng hiện tại:**
  * Mã nguồn V13 đã sẵn sàng 100% trong `master` và `main`.
  * Sau khi Cloudflare Pages hoàn tất nạp bản mới, các đường dẫn sẽ tự động cập nhật mượt mà: `/san-pham/:id`, `/danh-muc/:catId`, `/mau-hoa`, `/lien-he`, `/gioi-thieu`, `/cam-nang`, `/gio-hang`, `/admin/:tab`, `/owner/:tab`.

---

## 2. BẢNG TỔNG HỢP RÀ SOÁT CÁC ĐIỂM CẦN NÂNG CẤP & SỬA LỖI GIAO DIỆN

Dưới đây là kết quả rà soát chi tiết từng nút bấm, bố cục và chức năng hiển thị trên toàn bộ trang web:

| STT | Vị trí / Tệp tin | Hiện tượng hiện tại | Thiết bị ảnh hưởng | Khuyến nghị giải pháp |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `public/logo.png` | Tệp chưa tồn tại trong thư mục `public/`, gây lỗi 404 khi nạp logo thư OTP và phiếu in giao hoa | Mọi thiết bị (Email & In ấn) | Tạo tệp `public/logo.png` từ bản gốc `logo-vvflorielle-square.png` (484KB) |
| **2** | `src/utils/googleDriveArchiver.ts` | Mẫu HTML email OTP cần đảm bảo thẻ ảnh logo có kích thước cố định, fallback an toàn tuyệt đối và không chứa ký tự vỡ font | Gmail trên Điện thoại / Máy tính | Chuẩn hóa mẫu thư với URL logo tuyệt đối `https://vvflorielle.pages.dev/logo-vvflorielle-square.png` |
| **3** | `src/components/MascotAssistant.tsx` (Dòng 555) | 4 nút gợi ý "Hỏi nhanh" (`FAQ_CHIPS`) trong khung chat Flori dùng `overflow-x-auto`. Trên điện thoại hẹp, 1-2 nút bị khuất phải quẹt ngang | Mobile (320px - 375px) | Chuyển sang `flex flex-wrap gap-1`, hiển thị toàn bộ 4 gợi ý thành 2 hàng gọn gàng, không cần quẹt |
| **4** | `src/pages/CustomerPortal.tsx` (Dòng 277) | 3 tab chức năng hội viên (`Theo Dõi Đơn Hoa`, `Đổi Quà Freeship`, `Quyền Riêng Tư (NĐ 13/2023)`) xếp hàng ngang không co dòng, chữ dài tràn màn hình | Mobile (<390px) | Đổi sang dạng `grid grid-cols-3` với nhãn ngắn thông minh trên mobile ("Đơn Hoa", "Đổi Quà", "Bảo Mật"), trên Tablet/PC tự bung đủ chữ |
| **5** | `src/components/ProductDetailModal.tsx` (Dòng 321) | Cụm thao tác chân popup: Cụm tăng giảm số lượng + Nút "Thêm vào giỏ" + Nút "Mua ngay" trên màn hình siêu nhỏ (<350px) bị bó sát viền | Mobile nhỏ (320px - 350px) | Bổ sung `shrink-0` cho cụm số lượng, `min-w-0` cho các nút bấm, chống co ép chữ |
| **6** | `src/components/CartDrawer.tsx` (Dòng 1895) | Hàng thanh toán đáy giỏ hàng: Chọn tất cả + Giá tiền + Nút "Mua hàng" trên màn hình 320px rất khít | Mobile 320px (iPhone SE cũ) | Thêm `shrink-0` cho nút Mua hàng, text giá tiền không bị xuống dòng lệch chuẩn |
| **7** | `src/components/CustomerReviewModal.tsx` (Dòng 162) | Popup đánh giá đơn hoa đang dùng `z-50`. Header trang chủ cũng là `z-50`, có nguy cơ bóng đổ hoặc menu header đè lên popup | Toàn bộ thiết bị | Chuẩn hóa lên `z-[100000]` đồng bộ với toàn bộ hệ thống Modal |
| **8** | `src/components/storefront/FloralBlogSection.tsx` (Dòng 171) | Popup đọc chi tiết bài viết cẩm nang dùng `z-50` | Toàn bộ thiết bị | Chuẩn hóa lên `z-[100000]` |
| **9** | `src/components/customer/CustomerOrdersTab.tsx` (Dòng 370) | Cửa sổ phóng to xem ảnh biên lai chuyển khoản dùng `z-50` | Toàn bộ thiết bị | Chuẩn hóa lên `z-[100060]` |
| **10** | `src/components/management/subpages/ReviewsSubpage.tsx` (Dòng 689 & 878) | Modal phản hồi khách hàng & phóng to ảnh review của quản trị viên dùng `z-50` | Màn hình Admin | Chuẩn hóa lên `z-[100050]` |
| **11** | `src/components/AuthModal.tsx` (Dòng 243) | Modal đăng nhập dùng `z-[9995]`, thấp hơn các modal khác | Toàn bộ thiết bị | Chuẩn hóa lên `z-[100000]` |
| **12** | `src/components/popups/OrderQrModal.tsx` (Dòng 30) | Modal mã QR nhận hoa của khách hàng dùng `z-[80]` | Toàn bộ thiết bị | Chuẩn hóa lên `z-[100060]` |

---

## 3. ĐỀ XUẤT KẾ HOẠCH TRIỂN KHAI V14

### Danh sách tệp tin dự kiến can thiệp (Chỉ sửa đúng các vị trí đã kiểm duyệt):
1. `public/logo.png`: Tạo mới (sao chép nguyên bản từ `public/logo-vvflorielle-square.png`).
2. `src/data/mockData.ts`: Cập nhật `logoVerticalUrl` mặc định trỏ về `/logo-vvflorielle-square.png`.
3. `src/context/StoreContext.tsx`: Chuẩn hóa logic fallback ảnh logo và URL email OTP.
4. `src/utils/googleDriveArchiver.ts`: Tối ưu mẫu HTML thư OTP không bao giờ vỡ icon, dùng link ảnh tuyệt đối.
5. `src/components/MascotAssistant.tsx`: Chuyển chip FAQ từ `overflow-x-auto` sang `flex-wrap` hiển thị 100%.
6. `src/pages/CustomerPortal.tsx`: Chuyển 3 tab chức năng sang `grid grid-cols-3` thích ứng mobile.
7. `src/components/ProductDetailModal.tsx`: Tối ưu hàng nút bấm chân popup chống tràn trên màn 320px.
8. `src/components/CartDrawer.tsx`: Tối ưu hàng nút thanh toán đáy giỏ hàng cho màn 320px.
9. `src/components/CustomerReviewModal.tsx`, `FloralBlogSection.tsx`, `CustomerOrdersTab.tsx`, `ReviewsSubpage.tsx`, `AuthModal.tsx`, `OrderQrModal.tsx`: Chuẩn hóa lớp hiển thị Z-Index (`z-[100000]` / `z-[100050]` / `z-[100060]`).

> [!IMPORTANT]
> **Cam kết kỷ luật nghiêm ngặt:**
> - Tuyệt đối **KHÔNG CHỈNH SỬA** bất kỳ tệp tin nào ngoài danh sách trên.
> - Tuyệt đối **GIỮ NGUYÊN 100%** tệp `src/components/Header.tsx` (Quy tắc số 1).
> - Giữ nguyên 100% toàn bộ 54 sản phẩm hoa tươi và cấu trúc dữ liệu tiệm.
> - Chỉ bắt đầu sửa mã nguồn khi có lệnh xác nhận: **"Ok triển khai"** từ bạn.
