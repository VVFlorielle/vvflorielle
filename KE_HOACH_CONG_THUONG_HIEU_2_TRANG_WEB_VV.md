# KẾ HOẠCH TỔNG THỂ & THIẾT KẾ KIẾN TRÚC
## HỆ THỐNG CỔNG THƯƠNG HIỆU ĐA NỀN TẢNG (BRAND GATEWAY HUB)
### TÍCH HỢP 2 HỆ THỐNG ĐỘC LẬP: TIỆM HOA TƯƠI & TIỆM ĐỒ ĂN VẶT TAKEAWAY

> **Tài liệu chiến lược & hướng dẫn kỹ thuật phục vụ triển khai**  
> **Người đề xuất:** Chủ thương hiệu V&V Florielle  
> **Phiên bản:** 1.0 (Bản sao lưu trong thư mục dự án)

---

## MỤC LỤC
1. [TỔNG QUAN Ý TƯỞNG & TẦM NHÌN KINH DOANH](#1-tổng-quan-ý-tưởng--tầm-nhìn-kinh-doanh)
2. [KIẾN TRÚC KỸ THUẬT: 2 BỘ CODE RIÊNG – 1 TÊN MIỀN CHUNG](#2-kiến-trúc-kỹ-thuật-2-bộ-code-riêng--1-tên-miền-chung)
3. [THIẾT KẾ TRANG CHỦ CHUNG (BRAND GATEWAY HUB)](#3-thiết-kế-trang-chủ-chung-brand-gateway-hub)
4. [CƠ CHẾ 2 CỬA SỔ XEM TRƯỚC TRỰC TIẾP (LIVE PREVIEW WINDOWS)](#4-cơ-chế-2-cửa-sổ-xem-trước-trực-tiếp-live-preview-windows)
5. [THIẾT KẾ NÚT CHUYỂN ĐỔI THÔNG MINH TỰ ẨN MỜ (SMART FLOATING SWITCHER)](#5-thiết-kế-nút-chuyển-đổi-thông-minh-tự-ẩn-mờ-smart-floating-switcher)
6. [ĐẶC TẢ HỆ THỐNG BÁN ĐỒ ĂN VẶT MANG ĐI (SNACK STOREFRONT BLUEPRINT)](#6-đặc-tả-hệ-thống-bán-đồ-ăn-vặt-mang-đi-snack-storefront-blueprint)
7. [BẢNG SO SÁNH QUY TRÌNH VẬN HÀNH 2 MẢNG KINH DOANH](#7-bảng-so-sánh-quy-trình-vận-hành-2-mảng-kinh-doanh)
8. [LỘ TRÌNH TRIỂN KHAI TỪNG GIAI ĐOẠN (STEP-BY-STEP ROADMAP)](#8-lộ-trình-triển-khai-từng-giai-đoạn-step-by-step-roadmap)

---

## 1. TỔNG QUAN Ý TƯỞNG & TẦM NHÌN KINH DOANH

### 1.1. Bối cảnh & Giá trị chiến lược
- **Thương hiệu mẹ V&V**: Mở rộng hệ sinh thái phong cách sống (Lifestyle & F&B) phục vụ khách hàng đa chiều.
- **2 Trụ cột sản phẩm bổ trợ lẫn nhau**:
  - **Phân hệ Hoa tươi (V&V Florielle)**: Phục vụ cảm xúc, thẩm mỹ, quà tặng sinh nhật, sự kiện, lễ kỷ niệm (tần suất đặt 1–3 lần/tháng hoặc theo dịp, giá trị đơn cao từ 400.000đ – vài triệu đồng, đặt trước 1–2 ngày cọc 50%).
  - **Phân hệ Đồ ăn vặt & Đồ uống mang đi (V&V Snack & Bites)**: Phục vụ nhu cầu hàng ngày, liên hoan văn phòng, ăn vặt buổi chiều (tần suất đặt 2–4 lần/tuần, giá trị đơn vừa phải 50.000đ – 250.000đ, chế biến nhanh, giao hỏa tốc 30–45 phút).
- **Kết quả kinh doanh**: Khách mua hoa sẽ biết đến tiệm ăn vặt để đặt hàng ngày; ngược lại khách quen ăn vặt khi đến dịp sinh nhật/lễ sẽ nhớ ngay đến tiệm hoa cùng thương hiệu.

---

## 2. KIẾN TRÚC KỸ THUẬT: 2 BỘ CODE RIÊNG – 1 TÊN MIỀN CHUNG

Theo đúng yêu cầu của bạn: **"2 web này có hệ thống vận hành riêng, code riêng, chỉ dùng chung 1 trang chủ chung"**.

### 2.1. Cấu trúc thư mục & Dự án độc lập
Hệ thống sẽ được phân tách thành **3 khối mã nguồn riêng biệt**, không phụ thuộc lẫn nhau:
```
E:\
├── V&VFlorielle\               <-- [Bộ code 1 - Đã hoàn thiện] Web Bán Hoa Tươi
│   ├── src\
│   ├── dist\
│   └── package.json (Port 5173 / Sub-path /hoa)
│
├── VVSnackBites\               <-- [Bộ code 2 - Sẽ triển khai] Web Đồ Ăn Vặt Takeaway
│   ├── src\
│   ├── dist\
│   └── package.json (Port 5174 / Sub-path /an-vat)
│
└── VVBrandGateway\             <-- [Bộ code 3 - Cổng Trang Chủ Chung]
    ├── src\                    (Giao diện chào đón & 2 cửa sổ Live Preview)
    └── package.json (Port 5170 / Root domain /)
```

### 2.2. Phương án định tuyến tên miền (Domain Routing)
Dùng **1 tên miền duy nhất** (ví dụ: `vvflorielle.vn` hoặc `vvgroup.vn`), điều phối bằng Nginx hoặc Cloudflare Reverse Proxy:
1. `https://domain.vn/`  
   -> Mở **Trang chủ chung (Brand Gateway)** giới thiệu thương hiệu và 2 cửa sổ xem trước.
2. `https://domain.vn/hoa/` (hoặc `https://hoa.domain.vn/`)  
   -> Mở thẳng **Tiệm Hoa Tươi V&V Florielle** (hệ thống hiện tại).
3. `https://domain.vn/an-vat/` (hoặc `https://anvat.domain.vn/`)  
   -> Mở thẳng **Tiệm Đồ Ăn Vặt Takeaway** (hệ thống mới).

> **Ưu điểm vượt trội**: 
> - Khi sửa lỗi hoặc nâng cấp web ăn vặt, web hoa hoàn toàn không bị ảnh hưởng và ngược lại.
> - Cơ sở dữ liệu, quản lý kho, giỏ hàng của 2 web hoàn toàn tách biệt, không bao giờ bị xung đột đơn hàng.

---

## 3. THIẾT KẾ TRANG CHỦ CHUNG (BRAND GATEWAY HUB)

Trang chủ chung đóng vai trò là "Cổng vào không gian thương hiệu", mang đậm phong cách sang trọng, hiện đại:

### 3.1. Các thành phần giao diện chính:
1. **Header tối giản**: Logo V&V Group, câu slogan tinh tế (ví dụ: *"V&V – Sắc Hoa Trao Cảm Xúc, Vị Ngon Trọn Niềm Vui"*), nút Hotline/Liên hệ nhanh.
2. **Hero Banner Chào Đón**: Lời ngỏ ngắn gọn, ấm áp chào đón khách hàng bước vào không gian của V&V.
3. **Khu vực trung tâm (Trọng tâm)**: Hai ô lớn tương tác – hiển thị **Cửa sổ xem trước trực tiếp (Live Preview)** của 2 website.
4. **Footer chung**: Giới thiệu thông tin pháp lý, địa chỉ cửa hàng, hotline chung của cả 2 mảng.

---

## 4. CƠ CHẾ 2 CỬA SỔ XEM TRƯỚC TRỰC TIẾP (LIVE PREVIEW WINDOWS)

Đây là điểm nhấn độc đáo nhất theo ý tưởng của bạn:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TRANG CHỦ THƯƠNG HIỆU V&V                             │
│                  "Chọn không gian bạn muốn ghé thăm"                        │
│                                                                             │
│  ┌───────────────────────────────┐     ┌─────────────────────────────────┐  │
│  │ 🌸 CỬA SỔ 1: TIỆM HOA TƯƠI    │     │ 🧋 CỬA SỔ 2: TIỆM ĐỒ ĂN VẶT     │  │
│  │ ┌───────────────────────────┐ │     │ ┌─────────────────────────────┐ │  │
│  │ │ (Khung xem trước trang    │ │     │ │ (Khung xem trước trang      │ │  │
│  │ │  hoa tươi đang chạy mượt  │ │     │ │  đồ ăn vặt đang chạy mượt   │ │  │
│  │ │  cuộn mượt khi hover)     │ │     │ │  cuộn mượt khi hover)       │ │  │
│  │ └───────────────────────────┘ │     │ └─────────────────────────────┘ │  │
│  │ 🌸 V&V Florielle             │     │ 🧋 V&V Snack & Bites            │  │
│  │ [ 👉 BƯỚC VÀO TIỆM HOA ]     │     │ [ 👉 ĐẶT ĐỒ ĂN VẶT ]            │  │
│  └───────────────────────────────┘     └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.1. Cách thức hoạt động kỹ thuật:
- **Trạng thái bình thường**:
  - Hai khung cửa sổ được thiết kế giả lập màn hình laptop/tablet bo tròn góc với hiệu ứng đổ bóng kính 3D (Glassmorphism).
  - Bên trong hiển thị màn hình trang chủ sống động kèm hiệu ứng chuyển động nhẹ (micro-animations) của banner, sản phẩm hot.
- **Trạng thái khi người dùng trỏ chuột (Hover State)**:
  - Khung cửa sổ mở rộng nhẹ (scale 1.02), viền phát sáng viền LED cam/hồng sang trọng.
  - Tự động kích hoạt chế độ **Xem trước tương tác (Interactive Live Preview)**: Khách hàng có thể lăn chuột để xem nội dung trang chủ đang chạy bên trong khung như một website thu nhỏ thực thụ.
- **Hành động nhấp chuột (Click)**:
  - Khách nhấp vào bất kỳ đâu trên cửa sổ -> Hệ thống mở mượt mà website tương ứng với hiệu ứng chuyển cảnh trang trọng (fade-in transition).

---

## 5. THIẾT KẾ NÚT CHUYỂN ĐỔI THÔNG MINH TỰ ẨN MỜ (SMART FLOATING SWITCHER)

Khi khách hàng đã vào bên trong Web Hoa hoặc Web Ăn Vặt, họ luôn cần một lối tắt thuận tiện để chuyển qua lại mà không gây vướng mắt.

### 5.1. Thiết kế & Vị trí hiển thị:
- **Vị trí**: Đặt cố định ở mép trái màn hình (đối diện với cụm nút Hotline & Giỏ hàng bên phải để tạo sự cân bằng thị giác hoàn hảo).
- **Icon đại diện**:
  - Khi đang ở Web Hoa: Icon hiển thị hình **Hộp đồ ăn vặt / Ly trà sữa** kèm nhãn tooltip: *"Ghé Tiệm Ăn Vặt"*.
  - Khi đang ở Web Ăn Vặt: Icon hiển thị hình **Bó hoa hồng** kèm nhãn tooltip: *"Ghé Tiệm Hoa Tươi"*.
  - Có 1 nút phụ nhỏ ở trên để *"Về Cổng Thương Hiệu"*.

### 5.2. Thuật toán tự ẩn mờ thông minh (Smart Auto-Dimming UX):
1. **Khi người dùng đang lướt xem hàng (Trạng thái rảnh > 3 giây)**:
   - Nút tự động mờ xuống còn **độ trong suốt 20% – 25%** và thu gọn 50% vào mép viền màn hình.
   - Hoàn toàn không che khuất chữ, ảnh hoa hay nút mua hàng của khách.
2. **Khi người dùng rê chuột lại gần hoặc chạm tay vào mép màn hình**:
   - Nút lập tức sáng rõ 100%, bung ra đầy đủ với hiệu ứng nảy nhẹ (spring bounce), sẵn sàng để bấm chuyển trang ngay lập tức.
3. **Khi cuộn trang xuống sâu**:
   - Nút tự động chuyển sang chế độ ghim tinh gọn hình viên thuốc mờ (glass pill).

---

## 6. ĐẶC TẢ HỆ THỐNG BÁN ĐỒ ĂN VẶT MANG ĐI (SNACK STOREFRONT BLUEPRINT)

Khi bắt tay vào lập trình web đồ ăn vặt, hệ thống sẽ bao gồm các tính năng cốt lõi sau:

### 6.1. Danh mục món ăn đề xuất:
- **Nhóm 1 - Đồ ăn vặt nóng & Chiên giòn**: Khô gà lá chanh, chân gà sả tắc, nem chua rán, khoai tây lắc phô mai, bánh tráng trộn / cuộn phô mai,...
- **Nhóm 2 - Trà & Nước giải khát**: Trà mảng cầu, trà đào cam sả, trà sữa trân châu nhà làm, nước ép hoa quả tươi đóng chai mang đi.
- **Nhóm 3 - Snack đóng gói sẵn**: Các món ăn vặt đóng hộp pet lịch sự, khách có thể mua kèm làm quà tặng.
- **Nhóm 4 - Combo văn phòng / Tiệc mini**: Combo dành cho 2 người, 4 người, tiệc sinh nhật cơ quan.

### 6.2. Bộ tùy chọn món (Item Customization):
- Chọn mức cay (Không cay, Cay vừa, Cay nồng).
- Chọn Topping thêm (Thêm sốt, thêm trân châu, thêm phô mai...).
- Tùy chọn đóng gói bảo quản nóng hoặc đá để riêng.

### 6.3. Hệ thống đặt hàng & Giao nhận:
- **Tốc độ giao hàng**: Hỏa tốc 30 – 45 phút nội thành Hà Nội (kết nối Ahamove / GrabExpress hoặc shipper quán).
- **Hình thức thanh toán**: COD nhận hàng thanh toán, hoặc Quét mã VietQR chuyển khoản 100%.
- **Thông báo đơn hàng**: Tự động báo chuông âm thanh về máy bán hàng và gửi đơn về Telegram / Zalo của nhân viên bếp.

---

## 7. BẢNG SO SÁNH QUY TRÌNH VẬN HÀNH 2 MẢNG KINH DOANH

| Tiêu chí | 🌸 Tiệm Hoa Tươi (V&V Florielle) | 🧋 Tiệm Đồ Ăn Vặt (V&V Snack) |
| :--- | :--- | :--- |
| **Bản chất sản phẩm** | Hoa tươi thiết kế theo mẫu thủ công | Món ăn chế biến nóng / đồ uống pha sẵn |
| **Thời gian chuẩn bị** | Cần đặt trước 1 – 2 ngày (hoặc tối thiểu 3 – 4h) | Chuẩn bị nhanh 10 – 20 phút |
| **Quy định đặt cọc** | Bắt buộc cọc tối thiểu 50% qua VietQR | Thanh toán 100% hoặc COD khi nhận hàng |
| **Đặc thù giao hàng** | Ship xe máy nhẹ nhàng có đệm lót, giao theo ca hẹn | Giao hỏa tốc bằng túi giữ nhiệt trong 30–45 phút |
| **Giỏ hàng** | Quản lý theo mẫu hoa, màu nơ, thiệp chúc mừng | Quản lý theo món, topping, độ ngọt, sốt chấm |
| **Mã ưu đãi** | Voucher hoa tươi, hỗ trợ phí ship theo km | Mã freeship hỏa tốc, combo ăn vặt giờ trưa |

---

## 8. LỘ TRÌNH TRIỂN KHAI TỪNG GIAI ĐOẠN (STEP-BY-STEP ROADMAP)

Khi bạn sẵn sàng triển khai, chúng ta sẽ thực hiện theo 4 giai đoạn rõ ràng:

### Giai đoạn 1: Chuẩn bị Cổng Thương Hiệu Chung & Cửa sổ Live Preview
- Xây dựng trang Landing Hub chào đón (`VVBrandGateway`).
- Thiết kế 2 cửa sổ xem trước trực tiếp (Live Preview) mô phỏng trang chủ web hoa và web ăn vặt.
- Tích hợp nút chuyển trang thông minh tự ẩn mờ (Smart Floating Switcher).

### Giai đoạn 2: Lập trình Web Đồ Ăn Vặt Mang Đi (`VVSnackBites`)
- Lập trình giao diện chọn món đồ ăn vặt mang đi phong cách năng động, bắt mắt, tải nhanh.
- Thiết kế giỏ hàng đồ ăn nhanh, chọn topping, ghi chú gia vị.
- Tích hợp tính phí ship hỏa tốc và thanh toán VietQR / COD.

### Giai đoạn 3: Tích hợp Hệ thống Quản trị Kép (Double Admin)
- Nâng cấp màn hình quản trị để chủ quán (Owner) có thể chuyển đổi linh hoạt:
  - Xem danh sách đơn hoa cần cắm & lịch giao hoa.
  - Xem danh sách đơn ăn vặt cần chế biến & shipper đang giao.
  - Báo cáo tổng doanh thu của cả 2 mảng kinh doanh tại 1 màn hình duy nhất.

### Giai đoạn 4: Cấu hình Tên Miền, Tối ưu & Đóng gói App
- Cấu hình Reverse Proxy đưa cả 2 hệ thống lên cùng 1 tên miền chính.
- Kiểm thử tốc độ tải trang, trải nghiệm chuyển đổi giữa 2 web.
- Đóng gói App Android chung: 1 ứng dụng mở được cả 2 phân hệ.

---

> **Ghi chú bảo toàn:** File kế hoạch này được lưu trữ độc lập tại `E:\KE_HOACH_CONG_THUONG_HIEU_2_TRANG_WEB_VV.md` và `E:\V&VFlorielle\KE_HOACH_CONG_THUONG_HIEU_2_TRANG_WEB_VV.md`. Toàn bộ mã nguồn web hoa tươi hiện tại vẫn giữ nguyên trạng thái hoạt động hoàn hảo 100%. Khi nào bạn muốn bắt đầu làm, chúng ta chỉ cần mở file này ra và tiến hành từng bước!
