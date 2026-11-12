# 🌸 V&V FLORIELLE - HỒ SƠ BÀN GIAO TOÀN DIỆN KỸ THUẬT & QUY TRÌNH VẬN HÀNH WEBSITE
*(Master Technical Handover, Architecture Dossier & Project Roadmap)*

> **Đơn vị chủ quản**: Tiệm Hoa Tươi Nghệ Thuật V&V Florielle  
> **Địa chỉ Showroom**: Số 105 Doãn Kế Thiện, Phường Mai Dịch, Quận Cầu Giấy, TP. Hà Nội  
> **Hotline / Zalo tư vấn 24/7**: 0906.721.442 / 0912.345.678  
> **Phiên bản hệ thống**: v3.3 (Cập nhật ngày 12/11/2026 - Bản Bàn Giao Kiểm Định Toàn Diện & Kế Hoạch 5 Ưu Tiên Hàng Đầu)  
> **Mục đích tài liệu**: Đóng gói 100% hiện trạng dự án, toàn bộ tính năng đã hoàn thiện, hướng đang triển khai, kế hoạch chưa làm, quy định kỷ luật nghiêm ngặt và cẩm nang kỹ thuật để bất kỳ lập trình viên hay đối tác nào tiếp quản đều có thể đọc hiểu và bắt tay vào làm được ngay.

---

## 📑 MỤC LỤC TÀI LIỆU BÀN GIAO
1. [I. Quy Định & Kỷ Luật Làm Việc Tối Cao (BẮT BUỘC TUÂN THỦ)](#i-quy-định--kỷ-luật-làm-việc-tối-cao-bắt-buộc-tuân-thủ)
2. [II. Tổng Quan Dự Án & Ngăn Xếp Công Nghệ (Tech Stack)](#ii-tổng-quan-dự-án--ngăn-xếp-công-nghệ-tech-stack)
3. [III. Sơ Đồ Cấu Trúc Thư Mục & Vai Trò Tập Tin](#iii-sơ-đồ-cấu-trúc-thư-mục--vai-trò-tập-tin)
4. [IV. Toàn Bộ Những Gì ĐÃ LÀM ĐƯỢC (Completed Modules)](#iv-toàn-bộ-những-gì-đã-làm-được-completed-modules)
   - [1. Phân hệ Cửa hàng Công khai (Storefront & Catalog)](#1-phân-hệ-cửa-hàng-công-khai-storefront--catalog)
   - [2. Giỏ hàng Phong cách Shopee & Cước Ship Chuẩn Maps (`CartDrawer.tsx`)](#2-giỏ-hàng-phong-cách-shopee--cước-ship-chuẩn-maps-cartdrawertsx)
   - [3. Sổ Địa Chỉ Khách Hàng & Form Đặt Hoa Linh Hoạt](#3-sổ-địa-chỉ-khách-hàng--form-đặt-hoa-linh-hoạt)
   - [4. Trợ Lý Ảo Khách Hàng Flori (`MascotAssistant.tsx`)](#4-trợ-lý-ảo-khách-hàng-flori-mascotassistanttsx)
   - [5. Hệ Thống Quản Trị Kép Admin & Chủ Tiệm (`AdminPortal` & `OwnerPortal`)](#5-hệ-thống-quản-trị-kép-admin--chủ-tiệm-adminportal--ownerportal)
   - [6. Trợ Lý Thời Tiết Nổi Admin & Tối Ưu Popup (`AdminWeatherAssistant.tsx`)](#6-trợ-lý-thời-tiết-nổi-admin--tối-ưu-popup-adminweatherassistanttsx)
   - [7. Dọn Sạch Chú Thích Thừa Địa Lý Hà Nội (`hanoiLocations.ts`)](#7-dọn-sạch-chú-thích-thừa-địa-lý-hà-nội-hanoilocationsts)
   - [8. Bộ Kiểm Định Tự Động Playwright & Thư Viện 35 Ảnh Nghiệm Thu](#8-bộ-kiểm-định-tự-động-playwright--thư-viện-35-ảnh-nghiệm-thu)
5. [V. Bảng Ma Trận Kế Hoạch (Đã Làm - Đang Làm - Chưa Làm)](#v-bảng-ma-trận-kế-hoạch-đã-làm---đang-làm---chưa-làm)
6. [VI. KẾ HOẠCH 5: ĐỊNH VỊ GPS, QUẢN TRỊ VOUCHER HỘI VIÊN & TỐI ƯU GIAO DIỆN (ƯU TIÊN SỐ 1 - LÀM TIẾP THEO)](#vi-kế-hoạch-5-định-vị-gps-quản-trị-voucher-hội-viên--tối-ưu-giao-diện-ưu-tiên-số-1---làm-tiếp-theo)
7. [VII. KẾ HOẠCH 3: BẢO MẬT CẤP 2 TOÀN DIỆN (ƯU TIÊN SỐ 2 - CHỜ DUYỆT)](#vii-kế-hoạch-3-bảo-mật-cấp-2-toàn-diện-ưu-tiên-số-2---chờ-duyệt)
8. [VIII. KẾ HOẠCH 4: CỔNG THANH TOÁN VIETQR WEBHOOK TỰ ĐỘNG (ƯU TIÊN SỐ 3 - TẠM HOÃN)](#viii-kế-hoạch-4-cổng-thanh-toán-vietqr-webhook-tự-động-ưu-tiên-số-3---tạm-hoãn)
9. [IX. Dữ Liệu Cấu Hình & Tài Khoản Mặc Định](#ix-dữ-liệu-cấu-hình--tài-khoản-mặc-định)
10. [X. Quy Chuẩn Tính Cước Ship & Khung Giờ Hoạt Động](#x-quy-chuẩn-tính-cước-ship--khung-giờ-hoạt-động)
11. [XI. Kiến Trúc Dữ Liệu State & Khóa Lưu Trữ LocalStorage](#xi-kiến-trúc-dữ-liệu-state--khóa-lưu-trữ-localstorage)
12. [XII. Hướng Dẫn Thao Tác Kỹ Thuật, Đẩy Dữ Liệu & Triển Khai Hosting](#xii-hướng-dẫn-thao-tác-kỹ-thuật-đẩy-dữ-liệu--triển-khai-hosting)

---

## I. QUY ĐỊNH & KỶ LUẬT LÀM VIỆC TỐI CAO (BẮT BUỘC TUÂN THỦ)

Mọi kỹ sư, lập trình viên hoặc AI Agent khi tham gia chỉnh sửa mã nguồn dự án V&V Florielle **PHẢI TUÂN THỦ TUYỆT ĐỐI 5 ĐIỀU RĂN KỶ LUẬT SAU ĐÂY**:

1. ⛔ **ĐIỀU CẤM TUYỆT ĐỐI (PROTECTED FILE)**:  
   * **KHÔNG ĐƯỢC PHÉP CHỈNH SỬA, THAY THẾ HOẶC XÓA BỎ BẤT KỲ DÒNG CODE NÀO TRONG TỆP [`src/components/Header.tsx`](file:///E:/V&VFlorielle/src/components/Header.tsx)**.  
   * Phần Header đã đạt chuẩn hoàn hảo về thiết kế 3 cụm kính mờ độc lập (*Luminous Island Clusters*), logo căn giữa chuẩn mực và chức năng tìm kiếm thời gian thực. Bất kỳ tác động nào vào tệp này đều bị coi là vi phạm kỷ luật dự án nghiêm trọng.
2. 🎯 **BẢO TỒN KHUNG VIỀN & TIÊU ĐỀ TRANG CHỦ**:  
   * Khung tiêu đề trang chủ và khung bao bọc đã được chốt cố định theo chuẩn nghệ thuật của tiệm. Tuyệt đối không tự ý co kéo, thêm lề, đổi padding hay di dời vị trí.
3. 📦 **ĐẢM BẢO CHUẨN MỰC KHO HOA (54 MẪU HOA)**:  
   * Website duy trì chính xác **54 mẫu hoa thật** chia đều cho **6 danh mục lớn** (mỗi danh mục đúng **9 mẫu hoa**). Không được xóa bỏ mẫu hoa, không làm mất ảnh hoặc hiển thị thiếu số lượng.
4. 📱 **CHUẨN MỰC GIAO DIỆN POPUP MODAL (DESKTOP VS MOBILE)**:  
   * **Trên Desktop**: Ưu tiên giao diện **dạng ngang rộng rãi** (`md:grid md:grid-cols-2`, `md:max-w-4xl`), tận dụng diện tích màn hình để hiển thị thông tin 2 cột trực quan.
   * **Trên Mobile**: Dạng khung dọc, căn giữa màn hình tính từ mép trên thanh Dock (`pb-24` hoặc `pb-28`), giới hạn chiều cao tối đa `max-h-[calc(100dvh-120px)]`, **tuyệt đối không để đỉnh popup leo lên sát mép trên màn hình** và **không để chân popup chạm/đè lên thanh dock dưới đáy**.
5. 🔍 **BÁO CÁO MINH BẠCH - KHÔNG TỰ Ý SỬA NGOÀI PHẠM VI**:  
   * Khi phát hiện lỗi hoặc được yêu cầu rà soát, phải lập báo cáo kèm ảnh chụp chi tiết, phân tích rõ nguyên nhân và giải pháp, chờ phê duyệt trước khi viết code sửa đổi.

---

## II. TỔNG QUAN DỰ ÁN & NGĂN XẾP CÔNG NGHỆ (TECH STACK)

* **Tên thương hiệu**: **V&V Florielle - Tiệm Hoa Tươi Nghệ Thuật Cao Cấp**
* **Ngôn ngữ & Nền tảng**: `React 18.3` + `TypeScript 5.5` + `Vite 5.4`
* **Hệ thống tạo kiểu (Styling)**: `Tailwind CSS 3.4` + Custom Glassmorphism CSS (`glass.css`, `index.css`)
* **Bộ Icon**: `lucide-react` kết hợp bộ biểu tượng nổi 3D nghệ thuật độc quyền (`/public/icons/`)
* **Định dạng đồ họa tối ưu**: 100% hình ảnh sản phẩm và linh vật chuyển đổi sang chuẩn `WebP` nén chất lượng cao.
* **Xử lý trạng thái (State Management)**: `React Context API` (`StoreContext.tsx`) kết hợp đồng bộ bền vững với `localStorage`.
* **Âm thanh & Phản hồi xúc giác**: Web Audio API (`audioNotification.ts`) phát chuông chúc mừng và báo đơn mới.

---

## III. SƠ ĐỒ CẤU TRÚC THƯ MỤC & VAI TRÒ TẬP TIN

```
E:\V&VFlorielle/
├── public/                                      # Tài nguyên tĩnh phục vụ website
│   ├── icons/                                   # Bộ icon 3D pastel (icon-cart-3d, truck, gift, shield, user, pricing...)
│   ├── images/mascot/                           # 6 biểu cảm Linh vật Flori chuẩn WebP (1 đến 6)
│   ├── products/                                # 54 file ảnh mẫu hoa thật chuẩn WebP chất lượng cao
│   ├── logo-vvflorielle-*.webp                  # Logo thương hiệu định dạng vuông và ngang
│   ├── manifest.json & robots.txt & sitemap.xml # Cấu hình SEO và PWA di động
├── src/
│   ├── App.tsx                                  # Component gốc: Điều hướng View, Header, Dock, Modals
│   ├── types/index.ts                           # Định nghĩa toàn bộ TypeScript Type, Interface, Enums
│   ├── context/
│   │   └── StoreContext.tsx                     # Trung tâm xử lý State, CRUD Sản phẩm, Đơn hàng, Voucher, Router
│   ├── data/
│   │   ├── mockData.ts                          # Dữ liệu 54 mẫu hoa thật (9 mẫu/danh mục), danh mục, ngân hàng
│   │   └── hanoiLocations.ts                    # Dữ liệu 13 Quận/Huyện, Phường/Xã HN (tên sạch 100%), tọa độ & tính Km
│   ├── pages/
│   │   ├── PublicStore.tsx                      # Trang chủ khách hàng (Storefront chính)
│   │   ├── AdminPortal.tsx                      # Phân hệ Quản trị viên Super Admin (#admin)
│   │   ├── OwnerPortal.tsx                      # Phân hệ Quản trị tối cao Chủ Tiệm (#owner)
│   │   ├── CustomerPortal.tsx                   # Trang hồ sơ cá nhân khách hàng, ví voucher, đơn đã đặt
│   │   ├── ContactPage.tsx                      # Trang liên hệ, bản đồ showroom, kênh CSKH
│   │   ├── AboutPage.tsx                        # Trang giới thiệu nghệ nhân và câu chuyện thương hiệu
│   │   └── FlowerCarePage.tsx                   # Trang cẩm nang bảo quản và giữ hoa tươi lâu
│   ├── components/
│   │   ├── Header.tsx                           # [BẢO MẬT] Navbar kính mờ 3 cụm, tìm kiếm real-time
│   │   ├── MobileBottomDock.tsx                 # Thanh Dock điều hướng đáy màn hình cho khách
│   │   ├── CartDrawer.tsx                       # Giỏ hàng phong cách Shopee, sổ địa chỉ 4 slot, cọc VietQR
│   │   ├── FloatingCartWidget.tsx               # Nút giỏ hàng nổi xe đẩy màu trắng phát sáng
│   │   ├── MascotAssistant.tsx                  # Trợ lý ảo Flori tư vấn hoa cho khách hàng
│   │   ├── ProductDetailModal.tsx               # Modal xem nhanh chi tiết hoa
│   │   └── management/                          # Các thành phần phân hệ Quản trị
│   │       ├── ManagementHeader.tsx             # Navbar quản trị riêng biệt
│   │       ├── ManagementBottomDock.tsx         # Dock quản trị thông minh phân quyền Admin vs Owner
│   │       ├── ManagementModals.tsx             # Toàn bộ modal quản trị (Bảng giá BulkDiscount, Voucher...)
│   │       ├── AdminWeatherAssistant.tsx        # Trợ lý thời tiết nổi Admin, cấu hình phụ phí và giờ tiệm
│   │       └── subpages/                        # Các trang chức năng quản trị con (Orders, Products, CMS...)
```

---

## IV. TOÀN BỘ NHỮNG GÌ ĐÃ LÀM ĐƯỢC (COMPLETED MODULES)

### 1. Phân hệ Cửa hàng Công khai (Storefront & Catalog)
* **Kho hoa 54 mẫu chuẩn xác**: Đủ 6 danh mục lớn: *Bó Hoa, Giỏ Hoa, Bình Hoa, Kệ Khai Trương, Hộp Hoa, Lan Hồ Điệp* (mỗi danh mục chính xác 9 mẫu hoa).
* **Tìm kiếm thời gian thực**: Gõ từ khóa hoa, hệ thống tự động lọc và gợi ý dropdown 5 sản phẩm khớp nhất kèm giá và ảnh thu nhỏ.
* **Icon giỏ hàng phát sáng**: Nút giỏ hàng hình xe đẩy màu trắng phát sáng trên nền quả cầu cam luminous viền vàng neon, kéo thả mượt mà trên toàn màn hình.

### 2. Giỏ hàng Phong cách Shopee & Cước Ship Chuẩn Maps (`CartDrawer.tsx`)
* **Tích chọn từng mẫu hoa**: Khách hàng tích chọn ô checkbox của mẫu hoa nào thì hệ thống chỉ tính tiền mẫu đó, không bắt khách phải xóa hoa khỏi giỏ.
* **Bảng kê 4 tầng chi phí rõ ràng**: Tiền hoa đã chọn, Phí vận chuyển theo km, Giảm giá voucher, Phụ phí thời tiết/ngoài giờ (nếu có).
* **Cước ship chuẩn Hà Nội**: Tọa độ chuẩn xác từ Showroom 105 Doãn Kế Thiện. Dropdown nhận diện 13 Quận/Huyện và Phường/Xã kèm tính km tự động.

### 3. Sổ Địa Chỉ Khách Hàng & Form Đặt Hoa Linh Hoạt
* **Phân tách khách mua nhanh vs Khách đã đăng nhập**: Loại bỏ hoàn toàn chữ "khách vãng lai" xa cách, thay bằng nhãn "Quý khách mua nhanh" và badge "🌸 Đặt hoa nhanh".
* **Sổ địa chỉ tối đa 4 địa chỉ**: Khách hội viên lưu sẵn địa chỉ, chọn địa chỉ mặc định, tự động điền không cần gõ lại.
* **Khối tặng hoa hộ thu gọn**: Chỉ khi khách tích chọn *"Gửi hoa tặng hộ / Người nhận là người khác"*, form mới mở rộng để điền tên người nhận, SĐT và tùy chọn giấu tên người gửi.
* **Hóa đơn & Cọc 50% VietQR**: Tính chính xác 50% tiền cọc, hiển thị mã VietQR ngân hàng, số tiền còn lại khi nhận hoa, nút sao chép STK và cú pháp chuyển khoản.

### 4. Trợ Lý Ảo Khách Hàng Flori (`MascotAssistant.tsx`)
* Linh vật Flori kéo thả mượt mà, bóng thoại kính mờ gợi ý theo dịp (Sinh nhật, Khai trương, Tỏ tình...).
* Mở popup chat tư vấn, có các nút hỏi nhanh (FAQ Chips), giải đáp chính sách cọc, khoảng cách ship, bảo hành hoa tươi loại 1.

### 5. Hệ Thống Quản Trị Kép Admin & Chủ Tiệm (`AdminPortal` & `OwnerPortal`)
* Phân quyền rõ ràng giữa **Super Admin** (`admin`) và **Chủ Tiệm** (`vvflorielle`).
* **Khắc phục triệt để WSOD (Trắng màn hình)**: Sửa triệt để lỗi vi phạm *React Rules of Hooks* trong `BulkDiscountModal`.
* **Dãy nút giảm giá chống tràn chữ**: Hệ thống lưới `grid-cols-3 sm:grid-cols-6` hiển thị trọn vẹn các nút `[-5%]` đến `[-30%]`.

### 6. Trợ Lý Thời Tiết Nổi Admin & Tối Ưu Popup (`AdminWeatherAssistant.tsx`)
* Linh vật nổi kéo thả mượt mà, tự mờ khi idle trên mobile (opacity 25%), chạm vào hiện rõ 100%.
* Nhắc nhở chu kỳ 1 giờ bằng bóng thoại kính mờ thanh lịch viền ngọc lục bảo có mũi tên chỉ vào linh vật.
* Accordion thu gọn phụ phí thời tiết và ngoài giờ (`+5k`, `+10k`, `+15k`, `+20k`), xóa sạch chữ thừa `(Tạm để)`.
* Tách ca làm việc thành 2 hàng trên mobile; căn giữa popup không chạm đỉnh và không đè lên thanh dock (`pb-24`, `max-h-[calc(100dvh-120px)]`).

### 7. Dọn Sạch Chú Thích Thừa Địa Lý Hà Nội (`hanoiLocations.ts`)
* Đã rà soát và loại bỏ sạch sẽ 100% các chú thích thừa trong ngoặc đơn ở 10 phường/huyện:
  * `Phường Mai Dịch (Cùng phường tiệm)` $\rightarrow$ **`Phường Mai Dịch`**
  * `Phường Tây Mỗ (Vinhomes Smart City)` $\rightarrow$ **`Phường Tây Mỗ`**
  * `Phường Phú Thượng (Ciputra)` $\rightarrow$ **`Phường Phú Thượng`**
  * `Phường Quảng An (Hồ Tây)` $\rightarrow$ **`Phường Quảng An`**
  * `Phường Tràng Tiền (Bờ Hồ)` $\rightarrow$ **`Phường Tràng Tiền`**
  * `Phường Minh Khai (Times City)` $\rightarrow$ **`Phường Minh Khai`**
  * `Phường Hoàng Liệt (Linh Đàm)` $\rightarrow$ **`Phường Hoàng Liệt`**
  * `Phường Phúc Đồng (Vinhomes Riverside)` $\rightarrow$ **`Phường Phúc Đồng`**
  * `Huyện Hoài Đức (Vân Canh, An Khánh)` $\rightarrow$ **`Huyện Hoài Đức`**
  * `Huyện Gia Lâm (Vinhomes Ocean Park 1)` $\rightarrow$ **`Huyện Gia Lâm`**

### 8. Bộ Kiểm Định Tự Động Playwright & Thư Viện 35 Ảnh Nghiệm Thu
* Đã xây dựng bộ kiểm định tự động bằng Playwright Python (`scratch/audit_all_thorough.py` và `scratch/capture_final_audit.py`).
* 35 bức ảnh chụp thực tế màn hình Desktop & Mobile được lưu tại `audit_results/` đối soát từng góc cạnh.

---

## V. BẢNG MA TRẬN KẾ HOẠCH (ĐÃ LÀM - ĐANG LÀM - CHƯA LÀM)

| Tên Hạng Mục / Kế Hoạch | Thứ Tự Ưu Tiên | Trạng Thái | Mô Tả Tóm Tắt |
| :--- | :---: | :---: | :--- |
| **Kế hoạch 1**: Giỏ hàng Shopee & Cước ship Maps | - | **ĐÃ HOÀN THÀNH** | Tích chọn từng hoa, bảng kê 4 tầng chi phí, tính km tự động, form khách mua nhanh, khối tặng hoa hộ thu gọn. |
| **Kế hoạch 2**: Kho 54 mẫu hoa thật & WebP | - | **ĐÃ HOÀN THÀNH** | 54 mẫu hoa thật (đúng 9 mẫu/danh mục), nén WebP, sửa lỗi thụt lề padding-top, icon xe giỏ hàng trắng phát sáng. |
| **Kế hoạch 2.1**: Trợ lý thời tiết nổi Admin & Tối ưu Popup | - | **ĐÃ HOÀN THÀNH** | Linh vật nổi kéo thả, tự mờ khi idle trên mobile, nhắc nhở 1 giờ bóng thoại kính mờ, accordion thu gọn phụ phí, tách 2 hàng giờ, fix triệt để lỗi trắng trang `#owner`. |
| **Kế hoạch 2.2**: Dọn sạch chú thích thừa địa lý Hà Nội | - | **ĐÃ HOÀN THÀNH** | Đã xóa sạch 10 chú thích thừa trong ngoặc đơn (`(Cùng phường tiệm)`, `(Times City)`...), chuẩn hóa tên hành chính. |
| **Kế hoạch 5**: Định vị GPS, Quản trị Voucher Hội viên & Tối ưu vận hành | **ƯU TIÊN SỐ 1** | **CHỜ DUYỆT LỆNH TRIỂN KHAI** | GPS chính xác, chuẩn hóa cước ship cố định theo km, chặn khách chưa đăng nhập dùng voucher, voucher 1 lần/tài khoản hạn 7 ngày, nút cọc nổi thanh thoát, tải ảnh linh vật máy tính, đổi ảnh hoa demo bị sai. |
| **Kế hoạch 3**: Bảo Mật Cấp 2 Toàn Bộ Website | **ƯU TIÊN SỐ 2** | **CHỜ DUYỆT TRIỂN KHAI** | Xác thực 2FA/OTP Email, khóa tài khoản khi nhập sai mã PIN quá 5 lần, mã hóa dữ liệu nhạy cảm, chống spam đơn hàng, session timeout 30 phút. |
| **Kế hoạch 4**: Tích hợp Cổng thanh toán VietQR Webhook | **ƯU TIÊN SỐ 3** | **TẠM HOÃN (TƯƠNG LAI)** | Tạm thời chưa cần thiết theo chỉ đạo của chủ tiệm. Sau này có thể kết nối Cassio / SeAPay Webhook nhận biến động số dư tự động đổi trạng thái đơn. |

---

## VI. KẾ HOẠCH 5: ĐỊNH VỊ GPS, QUẢN TRỊ VOUCHER HỘI VIÊN & TỐI ƯU GIAO DIỆN (ƯU TIÊN SỐ 1 - LÀM TIẾP THEO)

> [!IMPORTANT]
> **Kế hoạch 5 là kế hoạch có mức độ ưu tiên CAO NHẤT hiện tại**. Người tiếp quản mã nguồn cần đọc kỹ 7 hạng mục chi tiết dưới đây để thực hiện chính xác:

### 1. Chuẩn Hóa Toàn Bộ Ảnh Sản Phẩm Demo Bị Sai (Lỗi 3)
* **Hiện trạng**: Mẫu `fl-01` ("Lẵng Hoa Để Bàn Phát Tài Thịnh Vượng") và một số mẫu hoa đang bị trỏ nhầm sang ảnh phòng tranh/nội thất thay vì hoa thật.
* **Yêu cầu thực hiện**: Rà soát lại toàn bộ 54 sản phẩm trong [`src/data/mockData.ts`](file:///E:/V&VFlorielle/src/data/mockData.ts), thay thế các ảnh sai bằng ảnh hoa tươi phù hợp trong thư mục `public/products/`. Tạm thời chỉ cần trỏ về các ảnh demo hoa tươi bó/giỏ liên quan và đẹp mắt.

### 2. Tách Dropdown Địa Chỉ Mobile Thành 2 Hàng (Lỗi 1)
* **Hiện trạng**: Hai dropdown `Quận / Huyện` và `Phường / Xã` đặt trên 1 hàng (`grid-cols-2`) làm chữ bị cắt cụt trên mobile (`Quận Cầu Giấy (1...`, `Phường Ma...`).
* **Yêu cầu thực hiện**: 
  * Trên Desktop: Giữ nguyên 2 cột ngang.
  * Trên Mobile: Chuyển thành xếp chồng 2 hàng (`grid-cols-1 sm:grid-cols-2`). Tên quận kèm số km và tên phường hiển thị đầy đủ 100%.

### 3. Tích Hợp Nút "Lấy Vị Trí Chính Xác Của Tôi" (GPS Geolocation)
* **Cơ chế**:
  * Thêm nút bấm **"📍 Lấy vị trí hiện tại"** cạnh ô địa chỉ.
  * Khi khách bấm, gọi HTML5 Geolocation API (`navigator.geolocation.getCurrentPosition`).
  * **Nếu khách cho phép (Allow)**: Lấy tọa độ GPS chính xác, tính khoảng cách chuẩn xác theo công thức Haversine đến 105 Doãn Kế Thiện, tự động điền số km và tự động chọn Quận/Phường tương ứng.
  * **Nếu khách từ chối**: Khách tiếp tục chọn Quận/Phường và gõ số nhà như bình thường.

### 4. Cơ Chế Cước Phí Cố Định Theo Km (Admin Tự Chỉnh Được)
* **Nguyên tắc**: Mọi khoảng cách đều có phí ship cố định theo các khung bậc km của tiệm. **Mặc định không có Freeship tự động**; Freeship chỉ xuất hiện khi khách có và áp dụng mã Voucher hợp lệ.
* **Bảng cước bậc thang chuẩn**:
  * Bậc 1: Dưới `2.0 km` $\rightarrow$ Cước cố định (VD: 10.000₫).
  * Bậc 2: Từ `2.0 km` đến `< 5.0 km` $\rightarrow$ Cước cố định (VD: 20.000₫).
  * Bậc 3: Từ `5.0 km` đến `< 10.0 km` $\rightarrow$ Cước cố định (VD: 30.000₫).
  * Bậc 4: Từ `10.0 km` đến `15.0 km` $\rightarrow$ Cước cố định (VD: 45.000₫).
  * Bậc 5: Trên `15.0 km` (Ngoại ô xa) $\rightarrow$ 45.000₫ + phụ phí mỗi km vượt (VD: 5.000₫/km).
* Admin và Chủ tiệm có thể trực tiếp sửa lại các mức giá này trong modal *Cấu hình cước phí 4 bậc* bất kỳ lúc nào.

### 5. Cơ Chế Ví Voucher & Quy Chuẩn Áp Dụng 2 Dạng Chuẩn Shopee (Chống Lạm Dụng)
* **Tổng quan cơ chế**: Tương tự như cơ chế của Shopee, Lazada hay các ứng dụng mua hàng hàng đầu, toàn bộ hệ thống Voucher được gắn chặt với danh tính Hội viên (`customerId`). Khách chưa đăng nhập không thể lưu và không thể sử dụng mã.
* **Tự động gợi ý & Tự điền mã tốt nhất (Auto-apply Best Voucher)**:
  * Khi hội viên vào giỏ hàng hoặc bước thanh toán, nếu trong Ví Voucher của tài khoản đang có mã Freeship hoặc mã giảm cước ship hợp lệ thỏa mãn điều kiện đơn hàng, hệ thống **tự động điền và kích hoạt mã ưu đãi tốt nhất** cho khách, giúp khách tiết kiệm chi phí tối đa mà không cần phải gõ lại thủ công.
* **2 Dạng Áp Dụng Voucher Chuẩn Sàn TMĐT**:
  * **DẠNG 1: Chọn mã tự điền từ Kho Voucher đã lưu của tài khoản (Ví Voucher)**:
    * **Cơ chế thu thập mã bên ngoài Web**:
      * Trên toàn bộ giao diện công khai (Top bar thông báo, Banner trang chủ, Popup sự kiện khuyến mại, danh mục hoa ưu đãi...), mỗi voucher đều có nút **"Lưu mã"** (hoặc "Thu thập voucher").
      * **Nếu đã đăng nhập**: Khách bấm *"Lưu mã"* $\rightarrow$ Mã được tự động thêm vào Kho Voucher của tài khoản, nút đổi trạng thái thành *"Đã lưu trong ví"*, hiển thị toast thông báo thành công.
      * **Nếu chưa đăng nhập / chưa có tài khoản**: Khách bấm *"Lưu mã"* $\rightarrow$ Hệ thống bật ngay popup thông báo bắt buộc: *"Vui lòng đăng nhập hoặc tạo tài khoản để lưu mã ưu đãi này vào ví voucher và sử dụng khi thanh toán!"* (kèm nút chuyển sang Form Đăng nhập / Đăng ký).
    * **Cơ chế chọn mã tại Giỏ hàng**:
      * Tại bước thanh toán giỏ hàng, khách bấm nút *"Chọn hoặc nhập mã Voucher"* $\rightarrow$ Hệ thống mở Modal/Drawer hiển thị danh sách toàn bộ voucher mà tài khoản đang sở hữu trong ví.
      * Khách chỉ cần tích chọn mã muốn dùng $\rightarrow$ Hệ thống tự điền mã, áp dụng chiết khấu ngay lập tức và cập nhật tổng tiền thanh toán.
  * **DẠNG 2: Tự nhập mã đặc biệt thủ công (Manual Input)**:
    * Dành riêng cho các mã ưu đãi độc quyền / mã bảo mật không hiển thị công khai trên giao diện web:
      * **Mã do Admin / CSKH cấp riêng**: Dành cho khách VIP, khách quen lâu năm, mã bồi thường khi đơn hoa giao trễ, hoặc quà tặng sinh nhật đặc biệt từ chủ tiệm.
      * **Mã đổi từ Điểm tích lũy thành viên (Loyalty Points / Hoa Xu)**: Hội viên dùng điểm tích lũy sau các đơn hàng trước đó để quy đổi thành mã voucher giảm giá (VD: 500 điểm $\rightarrow$ Voucher 50.000₫).
    * Khách tự gõ mã vào ô input và bấm nút **"Áp dụng"**. Hệ thống kiểm tra điều kiện (tài khoản đã đăng nhập, mã tồn tại, còn hạn, chưa sử dụng, đạt giá trị đơn tối thiểu) rồi trừ tiền ngay vào hóa đơn.
* **Chính sách Chống lạm dụng & Thời hạn sử dụng nghiêm ngặt**:
  * **Chưa đăng nhập = Không có mã**: Không được cấp mã và không được sử dụng bất kỳ voucher nào để tránh việc gian lận hoặc lạm dụng mã giảm giá.
  * **Chỉ dùng 1 lần duy nhất cho 1 tài khoản**: Mỗi mã voucher khi áp dụng thành công cho một đơn hàng đã cọc sẽ lập tức gắn cờ `isUsed: true` vào tài khoản đó, vĩnh viễn không thể tái sử dụng.
  * **Mã Giảm Phí Ship Định Kỳ Hàng Tháng (10k hoặc 20k)**: Mỗi tháng hệ thống cấp 01 mã giảm ship vào ví voucher của hội viên. Thời hạn sử dụng tối đa **7 ngày**, quá 7 ngày tự động hết hạn và biến mất khỏi ví.
  * **Mã Freeship Đơn Đầu Tiên**: Cấp tự động cho thành viên mới khi vừa đăng ký tài khoản thành công. Thời hạn sử dụng tối đa **7 ngày** kể từ ngày tạo tài khoản.
  * **Hiển thị hạn dùng trực quan**: Mỗi voucher trong ví đều hiển thị rõ ràng nhãn `Hạn dùng: Còn X ngày` (hoặc đếm ngược giờ khi sắp hết hạn) để kích thích khách hoàn tất đơn hoa sớm.

### 6. Nút "Xác Nhận & Cọc VietQR" Nổi Thanh Thoát Trên Mobile
* **Tuyệt đối không dùng khung hộp vuông lớn** bao quanh dưới đáy làm thô và chiếm diện tích màn hình.
* Thiết kế nút dạng **Nút bấm nổi độc lập (Floating Pill Button)** bo góc tròn mềm mại, nổi thanh thoát trên nền kính mờ nhẹ, hiển thị rõ số tiền cọc 50%.

### 7. Tính Năng Tải Ảnh Linh Vật Tùy Chọn Trong Admin
* Bổ sung nút **"📷 Tải ảnh linh vật mới từ thiết bị"** bên cạnh 6 biểu cảm có sẵn trong Trợ lý thời tiết / Quản lý linh vật.
* Cho phép Admin/Chủ tiệm tải ảnh PNG/WebP/JPG từ máy tính lên, xem trước ngay và lưu áp dụng cho linh vật toàn hệ thống.

---

## VII. KẾ HOẠCH 3: BẢO MẬT CẤP 2 TOÀN DIỆN (ƯU TIÊN SỐ 2 - CHỜ DUYỆT)

1. **Xác thực 2 Lớp (2FA / OTP qua Gmail)**: Đăng nhập từ thiết bị lạ yêu cầu OTP 6 số gửi về `traivuho@gmail.com`.
2. **Khóa Bảo Vệ Chống Dò PIN/Pass**: Nhập sai quá **5 lần** sẽ tự động khóa phiên trong **15 phút** và gửi email cảnh báo.
3. **Mã hóa Dữ liệu Nhạy Cảm**: Mã hóa số điện thoại, sổ địa chỉ và đơn hàng trong `localStorage`.
4. **Phân quyền RBAC nghiêm ngặt**: Nhân viên không được xem tổng doanh thu và không được đổi thông tin ngân hàng VietQR.
5. **Session Timeout 30 phút**: Tự động đăng xuất sau 30 phút không có thao tác chuột/phím.
6. **Rate Limiting Anti-Spam**: Giới hạn tối đa 3 đơn hoa trong 10 phút trên mỗi IP/trình duyệt nếu chưa thanh toán cọc.

---

## VIII. KẾ HOẠCH 4: CỔNG THANH TOÁN VIETQR WEBHOOK TỰ ĐỘNG (ƯU TIÊN SỐ 3 - TẠM HOÃN)

* **Trạng thái**: Tạm hoãn theo chỉ đạo của chủ tiệm vì chưa thực sự cần thiết ở thời điểm hiện tại.
* **Mô tả kỹ thuật tương lai**: Kết nối Cassio / SeAPay Webhook nhận biến động số dư tài khoản ngân hàng Vietcombank để tự động chuyển trạng thái đơn hàng sang *"Đã Cọc 50%"* mà không cần Admin phải duyệt thủ công.

---

## IX. DỮ LIỆU CẤU HÌNH & TÀI KHOẢN MẶC ĐỊNH

### 1. Tài Khoản Quản Trị Hệ Thống
* **Tài khoản Super Admin (Điều hành / Nhân viên)**:
  * Tên đăng nhập: `admin`
  * Mật khẩu: `17092000` (hoặc `admin123`)
  * Mã PIN vận hành: `26122025`
  * Đường dẫn truy cập: URL có hash `#admin` (VD: `http://localhost:5174/#admin`).
* **Tài khoản Chủ Tiệm (Owner / Giám Đốc Toàn Quyền)**:
  * Tên đăng nhập: `vvflorielle` hoặc `chuquan`
  * Mật khẩu: `19092003` (hoặc `vvflorielle2026`)
  * Mã PIN bảo mật: `26122025`
  * Đường dẫn truy cập: URL có hash `#owner` (VD: `http://localhost:5174/#owner`).
* **Email nhận thông báo & OTP**: `traivuho@gmail.com`

### 2. Thông Tin Tài Khoản Ngân Hàng Nhận Cọc VietQR
* **Ngân hàng**: Ngân hàng TMCP Ngoại thương Việt Nam (**Vietcombank**)
* **Số tài khoản**: `1029384756`
* **Tên chủ tài khoản**: `NGUYEN VAN V`
* **Mức tiền cọc mặc định**: `50%` tổng giá trị đơn hàng (khách có thể chọn cọc 50% hoặc trả đủ 100%).
* **Cú pháp chuyển khoản tự động**: `VVF [Mã Đơn]` (Ví dụ: `VVF 849201`).

### 3. Tài Khoản Khách Hàng VIP Trải Nghiệm Thử
* **Số điện thoại**: `0912345678` (Khách hàng: *Trần Văn Minh*)
* **Cấp bậc**: Hội viên VIP Ruby (Tích lũy 120 điểm).
* **Sổ địa chỉ mẫu**: Đã cấu hình sẵn địa chỉ nhận tại Phường Dịch Vọng Hậu, Quận Cầu Giấy.

---

## X. QUY CHUẨN TÍNH CƯỚC SHIP & KHUNG GIỜ HOẠT ĐỘNG

### 1. Bảng Định Mức Cước Ship Tính Từ 105 Doãn Kế Thiện
| Khoảng Cách Tính Theo Maps | Mức Cước Tiêu Chuẩn | Ghi Chú Ưu Đãi |
| :--- | :---: | :--- |
| **Dưới 2.0 km** | **10.000 ₫** | Bán kính gần (Freeship nếu áp mã voucher hợp lệ) |
| **Từ 2.0 km đến dưới 5.0 km** | **20.000 ₫** | Các quận Cầu Giấy, Nam Từ Liêm, Bắc Từ Liêm |
| **Từ 5.0 km đến dưới 10.0 km** | **30.000 ₫** | Đống Đa, Ba Đình, Thanh Xuân, Tây Hồ |
| **Từ 10.0 km đến 15.0 km** | **45.000 ₫** | Hoàn Kiếm, Hai Bà Trưng, Hoàng Mai, Hà Đông |
| **Trên 15.0 km** (Ngoại ô xa) | **45.000 ₫ + 5.000 ₫/km** | Long Biên, Gia Lâm, Hoài Đức, Đông Anh, Sóc Sơn... |

*(Ghi chú: Mức giá ship này Admin và Chủ tiệm có thể trực tiếp sửa lại trong trang Quản trị bất cứ lúc nào).*

### 2. Khung Giờ Hoạt Động Của Tiệm
* **Giờ mở cửa tiêu chuẩn**:
  * **Ca sáng**: `07:30 - 11:30`
  * **Ca chiều & tối**: `13:00 - 22:00`
* **Khung giờ đặc biệt (Giao ngoài giờ)**:
  * Thời gian: `11:30 - 13:00` (nghỉ trưa) và `22:00 - 07:30` (đêm khuya & sáng sớm).
  * Quy tắc tự động: Hệ thống lấy thời gian đặt hàng thực tế + **35 phút chuẩn bị cắm hoa**. Nếu thời điểm giao hoa rơi vào khung giờ đặc biệt, hệ thống tự động cộng **+5.000₫ phụ phí ngoài giờ** và thông báo rõ ràng trong giỏ hàng cho khách hàng. Mức phí này Admin có thể đổi nhanh `+5k`, `+10k`, `+15k`, `+20k` trong Trợ lý thời tiết.

---

## XI. KIẾN TRÚC DỮ LIỆU STATE & KHÓA LƯU TRỮ LOCALSTORAGE

| Khóa Lưu Trữ (`localStorage`) | Kiểu Dữ Liệu | Mục Đích Sử Dụng |
| :--- | :--- | :--- |
| `vvf_cart` | `Array<CartItem>` | Giỏ hoa hiện tại của khách hàng |
| `vvf_orders` | `Array<Order>` | Toàn bộ danh sách đơn hàng đã đặt trên hệ thống |
| `vvf_products` | `Array<Product>` | Kho 54 sản phẩm hoa tươi (hỗ trợ thêm/sửa/xóa qua CMS) |
| `vvf_weather_state` | `WeatherState` | Trạng thái thời tiết hiện tại, mức phụ phí và icon Flori |
| `vvf_saved_addresses` | `Array<SavedAddress>` | Sổ địa chỉ khách hàng (tối đa 4 địa chỉ) |
| `vvf_session_role` | `'ADMIN' \| 'CUSTOMER'` | Quyền hạn của phiên làm việc hiện tại |
| `vvf_active_admin_user` | `'admin' \| 'vvflorielle'` | Định danh tài khoản quản trị đang đăng nhập |
| `vvf_admin_pin` | `string` (Mặc định `26122025`) | Mã PIN quản trị 8 chữ số |
| `vvf_admin_weather_mascot` | `string` | Đường dẫn ảnh biểu cảm linh vật trợ lý Admin |
| `vvf_promotions` | `Array<Promotion>` | Danh mục mã giảm giá voucher đang hoạt động |
| `vvf_store_settings` | `StoreSettings` | Cấu hình tiệm: Tên, địa chỉ, STK ngân hàng, hotline |

---

## XII. HƯỚNG DẪN THAO TÁC KỸ THUẬT, ĐẨY DỮ LIỆU & TRIỂN KHAI HOSTING

### 1. Chạy Dự Án Ở Môi Trường Cục Bộ (Local Development)
Yêu cầu môi trường: **Node.js v18+** hoặc **v20+**.
```powershell
# Di chuyển vào thư mục dự án
cd "E:\V&VFlorielle"

# Cài đặt thư viện dependencies (nếu chưa có node_modules)
npm install

# Khởi chạy máy chủ phát triển
npm run dev
# Mở trình duyệt tại: http://localhost:5173 hoặc http://localhost:5174
```

### 2. Kiểm Tra Lỗi & Đóng Gói Production
Trước khi đưa code lên máy chủ hoặc báo cáo hoàn thành, **bắt buộc chạy 2 lệnh sau**:
```powershell
# 1. Kiểm tra toàn diện lỗi kiểu dữ liệu TypeScript (phải ra Exit code 0)
npx tsc -b

# 2. Đóng gói mã nguồn bản phát hành
npm run build
# Toàn bộ file tối ưu sẽ được sinh ra trong thư mục: E:\V&VFlorielle\dist\
```

### 3. Hướng Dẫn Đẩy Code Lên GitHub / GitLab
```powershell
# Kiểm tra trạng thái các file thay đổi
git status

# Thêm toàn bộ thay đổi vào hàng đợi commit
git add .

# Tạo commit ghi rõ nội dung thay đổi
git commit -m "docs: finalize master handover v3.3, clean ward annotations, prioritize plan 5 with strict voucher governance and GPS shipping"

# Đẩy mã nguồn lên nhánh chính (master)
git push origin master
```

---

## 🏁 LỜI KẾT & THÔNG ĐIỆP BÀN GIAO
Dự án **Tiệm Hoa Tươi Nghệ Thuật V&V Florielle** hiện tại đã đạt độ hoàn thiện rất cao, cấu trúc vững chắc, toàn bộ các lỗi hiển thị đã được nhận diện và lập phương án xử lý dứt điểm.

Bất kỳ nhân sự hoặc lập trình viên nào tiếp quản tiếp theo chỉ cần tuân thủ **Kỷ luật tệp Header [Chương I](#i-quy-định--kỷ-luật-làm-việc-tối-cao-bắt-buộc-tuân-thủ)** và bắt tay thực hiện ngay **[Kế Hoạch 5 (Chương VI)](#vi-kế-hoạch-5-định-vị-gps-quản-trị-voucher-hội-viên--tối-ưu-giao-diện-ưu-tiên-số-1---làm-tiếp-theo)** là hệ thống sẽ đạt mức độ hoàn mỹ cao nhất!
