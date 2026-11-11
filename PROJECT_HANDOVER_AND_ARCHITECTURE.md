# 🌸 V&V FLORIELLE - HỒ SƠ BÀN GIAO TOÀN DIỆN KỸ THUẬT & QUY TRÌNH VẬN HÀNH WEBSITE
*(Master Technical Handover, Architecture Dossier & Project Roadmap)*

> **Đơn vị chủ quản**: Tiệm Hoa Tươi Nghệ Thuật V&V Florielle  
> **Địa chỉ Showroom**: Số 105 Doãn Kế Thiện, Phường Mai Dịch, Quận Cầu Giấy, TP. Hà Nội  
> **Hotline / Zalo tư vấn 24/7**: 0906.721.442 / 0912.345.678  
> **Phiên bản hệ thống**: v3.2 (Cập nhật tháng 11/2026 - Bản hoàn thiện nghiệm thu)  
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
5. [V. Bảng Ma Trận Kế Hoạch (Đã Làm - Đang Làm - Chưa Làm)](#v-bảng-ma-trận-kế-hoạch-đã-làm---đang-làm---chưa-làm)
6. [VI. Kế Hoạch Tiếp Theo: Bảo Mật Cấp 2 Toàn Diện (Giai Đoạn 3)](#vi-kế-hoạch-tiếp-theo-bảo-mật-cấp-2-toàn-diện-giai-đoạn-3)
7. [VII. Dữ Liệu Cấu Hình & Tài Khoản Mặc Định](#vii-dữ-liệu-cấu-hình--tài-khoản-mặc-định)
8. [VIII. Quy Chuẩn Tính Cước Ship & Khung Giờ Hoạt Động](#viii-quy-chuẩn-tính-cước-ship--khung-giờ-hoạt-động)
9. [IX. Kiến Trúc Dữ Liệu State & Khóa Lưu Trữ LocalStorage](#ix-kiến-trúc-dữ-liệu-state--khóa-lưu-trữ-localstorage)
10. [X. Hướng Dẫn Thao Tác Kỹ Thuật, Đẩy Dữ Liệu & Triển Khai Hosting](#x-hướng-dẫn-thao-tác-kỹ-thuật-đẩy-dữ-liệu--triển-khai-hosting)

---

## I. QUY ĐỊNH & KỶ LUẬT LÀM VIỆC TỐI CAO (BẮT BUỘC TUÂN THỦ)

Mọi kỹ sư, lập trình viên hoặc AI Agent khi tham gia chỉnh sửa mã nguồn của V&V Florielle **PHẢI TUÂN THỦ 100% NGUYÊN TẮC SAU ĐÂY**:

> ### 🛑 NGUYÊN TẮC BẤT KHẢ XÂM PHẠM:
> 1. **ĐÚNG PHẠM VI YÊU CẦU**: Chỉ được quyền sửa code và nội dung được giao. Tuyệt đối **KHÔNG** tự ý sửa, xóa hay động chạm tới các phần khác ngoài phạm vi được chỉ định.
> 2. **CẤM ĐỘNG VÀO `Header.tsx`**: Thanh header điều hướng đã được thiết kế tinh xảo, ổn định hoàn toàn và cố định theo bố cục tối ưu. **Tuyệt đối không chỉnh sửa `src/components/Header.tsx`** dù trong bất kỳ tình huống nào.
> 3. **MINH BẠCH - KHÔNG ĐƯỢC GIẤU LỖI**: Nếu quá trình sửa phần được yêu cầu gây lỗi lây lan sang phần khác, phải **lập tức báo cáo trung thực** cho chủ tiệm/quản lý để tìm hướng khắc phục, tuyệt đối không được âm thầm che đậy.
> 4. **QUY TRÌNH KIỂM THỬ NGHIÊM NGẶT TRƯỚC KHI BÁO CÁO**:
>    * Bước 1: Chạy kiểm tra tĩnh TypeScript: `npx tsc -b` (bắt buộc Exit code 0).
>    * Bước 2: Chạy kiểm tra đóng gói Production: `npm run build` (bắt buộc Exit code 0).
>    * Bước 3: Chạy kịch bản kiểm thử giao diện thực tế (Playwright / Chụp ảnh màn hình) ở cả 2 chế độ **Desktop (1440x900)** và **Mobile (390x844)**.
>    * Bước 4: Sau khi rà soát không còn sót bất kỳ bug hay lỗi lệch giao diện nào mới được phép báo cáo nghiệm thu.
> 5. **QUY CHUẨN TÀI NGUYÊN HÌNH ẢNH**:
>    * Toàn bộ ảnh sản phẩm hoa tươi phải là ảnh mẫu thật rõ nét, chụp góc nghiêng nghệ thuật, cận cảnh hoa hoàn thiện.
>    * Tuyệt đối **KHÔNG dùng ảnh dính logo, watermark hoặc tên thương hiệu của bên thứ ba**.
>    * Toàn bộ ảnh hoa và logo tải lên phải được nén sang chuẩn **WebP** chất lượng cao để đảm bảo tốc độ tải trang dưới 1.5 giây.

---

## II. TỔNG QUAN DỰ ÁN & NGĂN XẾP CÔNG NGHỆ (TECH STACK)

### 1. Thông Tin Thương Hiệu
* **Tên thương hiệu**: Tiệm Hoa Tươi Nghệ Thuật V&V Florielle (`V&V Florielle`)
* **Địa chỉ Showroom**: 105 Doãn Kế Thiện, Phường Mai Dịch, Quận Cầu Giấy, TP. Hà Nội
* **Tọa độ tiệm Maps**: `21.0402° B, 105.7778° Đ`
* **Sản phẩm kinh doanh**: Hoa tươi thiết kế cao cấp nhập khẩu (Ecuador, Đà Lạt), giỏ hoa, kệ khai trương, hoa tình yêu, hoa sinh nhật, lan hồ điệp nghệ thuật, hoa chia buồn.
* **Đặc trưng dịch vụ**: Giao hỏa tốc 15 phút nội thành, quét VietQR cọc 50% tự động 24/7, trợ lý ảo AI chăm sóc khách hàng.

### 2. Ngăn Xếp Công Nghệ (Tech Stack)
* **Ngôn ngữ & Nền tảng**: React 18, TypeScript 5.x.
* **Bộ dựng ứng dụng**: Vite 5.4.x (tốc độ khởi động HMR mili-giây, đóng gói Rollup siêu nhẹ).
* **Giao diện & Hiệu ứng**: 
  * Tailwind CSS 3.4.x
  * Custom Glassmorphism (lớp kính mờ cao cấp, ambient light blobs, viền gradient phản chiếu)
  * `lucide-react` (bộ icon đồng bộ, nét mảnh tinh tế stroke 1.8–2.3)
  * `canvas-confetti` (hiệu ứng pháo hoa chúc mừng khi đặt đơn hoặc duyệt cọc thành công)
* **Quản lý trạng thái (State Engine)**: Single-Session Store tập trung qua React Context (`StoreContext.tsx`), tự động đồng bộ liên tục 2 chiều với `localStorage`.
* **Tự động hóa kiểm thử (Testing Automation)**: Playwright (Chromium/Edge) kiểm thử E2E tự động, chụp ảnh màn hình nghiệm thu đa kích thước màn hình.

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
│   ├── _redirects & _headers                    # Cấu hình rewrite SPA cho Netlify/Cloudflare
├── src/
│   ├── App.tsx                                  # Component gốc: Điều hướng View, Header, Dock, Modals
│   ├── types/index.ts                           # Định nghĩa toàn bộ TypeScript Type, Interface, Enums
│   ├── context/
│   │   └── StoreContext.tsx                     # Trung tâm xử lý State, CRUD Sản phẩm, Đơn hàng, Voucher, Router
│   ├── data/
│   │   ├── mockData.ts                          # Dữ liệu 54 mẫu hoa thật (9 mẫu/danh mục), danh mục, ngân hàng
│   │   └── hanoiLocations.ts                    # Dữ liệu 13 Quận/Huyện, Phường/Xã HN, tọa độ & tính Km
│   ├── pages/
│   │   ├── PublicStore.tsx                      # Trang chủ khách hàng (Storefront chính)
│   │   ├── CatalogPage.tsx                      # Trang Bộ Sưu Tập đầy đủ 54 mẫu hoa với bộ lọc đa tiêu chí
│   │   ├── AboutPage.tsx                        # Trang Câu chuyện thương hiệu V&V Florielle
│   │   ├── ContactPage.tsx                      # Trang Liên hệ & Bản đồ vị trí 105 Doãn Kế Thiện
│   │   ├── CarePage.tsx                         # Trang Cẩm nang dưỡng hoa tươi nghệ thuật
│   │   ├── CustomerPortal.tsx                   # Trang Quản lý tài khoản khách, sổ địa chỉ, lịch sử đơn
│   │   ├── AdminPortal.tsx                      # Phân hệ Quản trị viên Nhân viên / Điều hành
│   │   └── OwnerPortal.tsx                      # Phân hệ Quản trị tối cao Chủ Tiệm / Giám đốc
│   ├── components/
│   │   ├── Header.tsx                           # Thanh điều hướng công khai Desktop (CẤM SỬA)
│   │   ├── MarqueeBanner.tsx                    # Thanh chữ chạy thông báo khuyến mãi & thời tiết tiệm
│   │   ├── MobileBottomDock.tsx                 # Thanh Dock điều hướng kính mờ trên điện thoại
│   │   ├── FloatingCartWidget.tsx               # Widget giỏ hoa xe đẩy trắng phát sáng nổi kéo thả
│   │   ├── FloatingContactWidget.tsx            # Widget liên hệ nổi đa kênh (Zalo, Hotline, Messenger)
│   │   ├── MascotAssistant.tsx                  # Trợ lý ảo Flori cho khách hàng góc trái màn hình
│   │   ├── ProductCard.tsx                      # Thẻ hoa tươi (nút Thêm giỏ, Đặt hoa, badge Hot/Mới)
│   │   ├── ProductDetailModal.tsx               # Modal xem ảnh phóng to, thiệp mừng, chi tiết loài hoa
│   │   ├── CartDrawer.tsx                       # Giỏ hàng Shopee, Sổ địa chỉ 4 slot, Cước ship, VietQR
│   │   ├── Footer.tsx                           # Chân trang thống nhất 3 cột chuẩn Studio
│   │   ├── ScrollToTopButton.tsx                # Nút cuộn mượt về đầu trang
│   │   └── management/                          # Các thành phần phân hệ Quản trị
│   │       ├── ManagementHeader.tsx             # Navbar quản trị riêng biệt
│   │       ├── ManagementBottomDock.tsx         # Dock điều hướng quản trị trên di động
│   │       ├── ManagementModals.tsx             # Các Modal quản trị (BulkDiscount, Shipping, Voucher, Product...)
│   │       ├── AdminWeatherAssistant.tsx        # Trợ lý thời tiết nổi Admin (nhắc 1h, tự mờ khi idle, accordion thu gọn)
│   │       ├── QrScannerModal.tsx               # Quét camera mã QR đơn hàng trực tiếp
│   │       └── subpages/                        # Các tab nghiệp vụ (CMS, Đơn hàng, Voucher, Branding...)
│   └── styles/
│       ├── index.css                            # CSS toàn cục, Tailwind base, scrollbar tùy chỉnh
│       └── glass.css                            # Hiệu ứng kính mờ Luminous Glassmorphism, rules modal & overlay
├── PROJECT_HANDOVER_AND_ARCHITECTURE.md         # File tài liệu bàn giao kỹ thuật trực tiếp tại mã nguồn
├── package.json                                 # Danh mục dependencies và scripts
└── vite.config.ts                               # Cấu hình Vite bundler
```

---

## IV. TOÀN BỘ NHỮNG GÌ ĐÃ LÀM ĐƯỢC (COMPLETED MODULES)

### 1. Phân hệ Cửa hàng Công khai (Storefront & Catalog)
* **54 Sản phẩm hoa tươi mẫu thật chuẩn WebP**:
  * Đầy đủ 6 danh mục nghệ thuật, mỗi danh mục có **đúng chuẩn 9 sản phẩm** (`6 × 9 = 54` mẫu):
    1. *Hoa Khai Trương (9 mẫu)*: Kệ hoa hồng hoàng kim 2-3 tầng, lẵng phát tài phát lộc.
    2. *Hoa Sinh Nhật (9 mẫu)*: Bó hoa hướng dương rực rỡ, giỏ hoa tone pastel dịu ngọt.
    3. *Hoa Tình Yêu (9 mẫu)*: Bó hoa hồng đỏ Ecuador chân ái, hộp tim hoa tình nồng.
    4. *Lan Hồ Điệp (9 mẫu)*: Chậu lan đại hồ điệp trắng tuyết, lan vàng hoàng gia.
    5. *Hoa Chúc Mừng (9 mẫu)*: Bình gốm sứ vạn sự hanh thông, lẵng hoa tươi mừng thăng tiến.
    6. *Hoa Chia Buồn (9 mẫu)*: Vòng hoa lan trắng trang nghiêm, kệ hoa viếng thành kính.
  * Toàn bộ ảnh đã được nén thành WebP chất lượng cao, dung lượng giảm hơn 80%, tốc độ hiển thị tức thì.
* **Căn chỉnh thụt lề chuẩn xác (Fix khoảng cách Padding-Top)**:
  * Trang chủ giữ nguyên khoảng cách gọn gàng nguyên bản (`pt-24 sm:pt-32`).
  * Tất cả các trang chuyên mục (`CatalogPage`, `AboutPage`, `ContactPage`, `CarePage`, `CustomerPortal`) đều được tinh chỉnh khoảng đệm thụt lề rộng rãi (`pt-[124px] sm:pt-[156px]`), đảm bảo thanh Header kính và Marquee chữ chạy **không bao giờ che mất viền cong và tiêu đề của trang**.

### 2. Giỏ hàng Phong cách Shopee & Cước Ship Chuẩn Maps (`CartDrawer.tsx`)
* **Tích chọn từng món & Chọn tất cả (Shopee Style)**:
  * Mỗi sản phẩm trong giỏ có checkbox riêng biệt.
  * Hàng tiêu đề có nút `[✓] Chọn tất cả (X mẫu hoa)`.
  * Khách có thể bỏ chọn những món chưa muốn mua ngay; món bị bỏ chọn **vẫn nằm an toàn trong giỏ hàng, tuyệt đối không bị xóa**.
  * Chỉ những món được tích chọn mới được tính tổng tiền hoa và chuyển sang đơn hàng khi đặt mua.
* **Thanh vị trí nhận hoa đỉnh giỏ hàng**:
  * Tự động hiển thị khoảng cách km và cước vận chuyển tương ứng từ 105 Doãn Kế Thiện.
  * Có danh sách lựa chọn Quận/Huyện và Phường/Xã Hà Nội mượt mà.
* **Tích hợp Voucher Shopee**:
  * Chọn hoặc nhập mã ưu đãi (`FREESHIP30K`, `VVFNEW20`, `VVF50K`).
  * Hiển thị số tiền được giảm rõ ràng (`-30.000₫`).
* **Bảng kê 4 tầng chi phí minh bạch**:
  1. *Tiền hoa đã chọn*
  2. *Phí vận chuyển theo km*
  3. *Phụ phí thời tiết* (mưa, lạnh rét, bão gió do Trợ lý Admin cập nhật)
  4. *Phụ phí giao ngoài khung giờ* (nếu giao sáng sớm hoặc đêm khuya)
* **Nút Mua Hàng thông minh**: `Mua Hàng (X mẫu) - [Tổng tiền] →`.
* **Icon Giỏ hàng nổi**: Quả cầu kính màu cam siêu thị với **biểu tượng xe đẩy màu trắng phát sáng** (`ShoppingCart`) nổi bật và kéo thả tự do.

### 3. Sổ Địa Chỉ Khách Hàng & Form Đặt Hoa Linh Hoạt
* **Sổ địa chỉ tối đa 4 địa chỉ cho khách đã đăng nhập**:
  * Tự động lưu và điền sẵn địa chỉ mặc định, khách không cần gõ lại mỗi lần mua hoa.
  * Thẻ chọn nhanh giữa các địa chỉ (Nhà riêng, Văn phòng, Người thân...).
  * Tích chọn `[✓] Đặt làm địa chỉ mặc định`.
* **Khách mua trực tiếp**: Đổi tên văn minh, lịch sự thành `🌸 Đặt Hoa Nhanh (Quý khách mua trực tiếp)` (thay thế chữ "Khách vãng lai" trước đây).
* **Mục tặng hoa hộ**: Khối `🎁 Gửi hoa tặng hộ / Người nhận là người khác` mặc định thu gọn; khi khách bấm tích chọn mới mở rộng phần điền:
  * Họ tên người nhận hoa
  * Số điện thoại người nhận hoa
  * Tùy chọn bảo mật: `[✓] Tiết lộ tên người gửi cho người nhận` (phù hợp tặng ẩn danh).
* **Quy trình thanh toán & Cọc đơn**:
  * Tạo mã đơn hàng tự động (VD: `#849201`).
  * Sinh mã VietQR chuẩn ngân hàng với số tiền cọc 50% hoặc thanh toán 100%, cú pháp chuẩn: `VVF [Mã Đơn]`.
  * Có nút sao chép STK và Cú pháp 1-chạm.
  * Khách hàng tải ảnh biên lai (Bill) chuyển khoản; hệ thống hiển thị đếm ngược 2 phút đối soát tự động.

### 4. Trợ Lý Ảo Khách Hàng Flori (`MascotAssistant.tsx`)
* Nổi góc dưới màn hình, kéo thả tự do theo ý muốn.
* Tích hợp hội thoại AI tư vấn chọn hoa, cẩm nang chăm sóc và hướng dẫn cọc đơn.
* Tích hợp âm thanh giọng nói nữ dễ thương mô phỏng.
* **Tự động đồng bộ thời tiết**: Tự động đưa ra lời khuyên thời tiết thực tế cho khách (VD: *"Hà Nội đang mưa gió, Flori sẽ nhắc shipper bọc màng bảo vệ hoa 2 lớp cho bạn nhé!"*).

### 5. Hệ Thống Quản Trị Kép Admin & Chủ Tiệm (`AdminPortal` & `OwnerPortal`)
* Phân quyền 2 cấp độ:
  * **Super Admin** (`admin`): Quản lý vận hành hàng ngày, duyệt cọc đơn hàng, quản lý sản phẩm.
  * **Chủ Tiệm** (`vvflorielle` / `chuquan`): Toàn quyền xem báo cáo tài chính, quản lý doanh thu, mã PIN bảo mật, nhân viên.
* **Khắc phục triệt để WSOD (Trắng màn hình)**: Chuẩn hóa toàn bộ thứ tự React Hook trong `BulkDiscountModal`, router tiền tố `#owner` và `#admin`, 0 lỗi crash console.
* **Dãy nút giảm giá chống tràn chữ**: Hệ thống lưới `grid-cols-3 sm:grid-cols-6` tự động dàn 2 hàng x 3 nút trên điện thoại và 1 hàng x 6 nút trên máy tính, hiển thị trọn vẹn `[-25%]`, `[-30%]`.
* **Quản trị đơn hàng**: Xem chi tiết bill cọc, duyệt cọc 1-chạm, in phiếu giao hoa, chuyển trạng thái đơn (Chờ cọc $\rightarrow$ Đang cắm hoa $\rightarrow$ Đang giao $\rightarrow$ Hoàn thành $\rightarrow$ Hủy), đổi phí ship thủ công cho từng đơn nếu cần.
* **Quản lý sản phẩm (CMS Studio)**: Thêm hoa mới, chỉnh sửa giá, đổi ảnh WebP, đánh dấu Hot/Freeship, bật/tắt trạng thái còn hàng/hết hàng.
* **Quản lý Voucher**: Tạo mã giảm giá theo %, theo tiền cố định hoặc Freeship, quy định đơn tối thiểu.
* **Quản lý Khách hàng & Tích điểm VIP**: Danh sách hội viên thân thiết, cấp độ thành viên, lịch sử mua hàng.
* **Quản lý Linh vật**: Chọn đổi diện mạo linh vật đại diện Flori (6 biểu cảm hoạt họa).
* **Quét mã QR bằng Camera**: Quét biên lai hoặc mã đơn hàng trực tiếp bằng camera thiết bị (`QrScannerModal`).

### 6. Trợ Lý Thời Tiết Nổi Admin & Tối Ưu Popup (`AdminWeatherAssistant.tsx`)
* **Linh vật nổi trong suốt, không viền tròn trắng**: Đồng bộ 1:1 với linh vật bên ngoài, kéo thả siêu mượt không bị khựng.
* **Tính năng tự mờ khi không dùng (Idle Auto-fade trên Mobile)**: Sau 4.5 giây không thao tác, linh vật tự giảm độ đậm xuống `opacity-25`, chạm vào lập tức phục hồi `opacity-100`.
* **Bóng thoại nhắc nhở 1 giờ tinh tế**: Bóng thoại phong cách **kính mờ ánh lục (`bg-white/95 text-slate-800 border-emerald-300`)** có mũi tên chỉ đuôi thoại hướng thẳng vào linh vật, không còn khối hộp đen xì đè trên đỉnh đầu.
* **Xóa bỏ chữ `(Tạm để)`**: Các nút phụ phí hiển thị ngắn gọn: `+5k`, `+10k`, `+15k`, `+20k`.
* **Thu gọn thông minh (Collapsible Accordion)**:
  * *"Chỉnh Mức Phí Riêng Cho Từng Thời Tiết"* và *"Phụ Phí Giao Giờ Đặc Biệt"* được gom gọn trong hàng thẻ có nút `[Chỉnh chi tiết ⌵]`, triệt tiêu sự rối mắt của hơn 20 nút bấm phơi bày cùng lúc.
* **Tách khung chọn giờ thành 2 hàng trên Mobile**:
  * Chuyển thành `grid-cols-1 sm:grid-cols-2`: Ca Sáng ở hàng trên, Ca Chiều/Tối ở hàng dưới.
  * Các ô nhập giờ `[07 : 30 SA]` và `[11 : 30 SA]` có 100% chiều ngang, không bị cắt cụt hay tràn biểu tượng đồng hồ.
* **Định vị chuẩn trên Mobile & Ẩn footer thừa**:
  * Căn giữa theo chiều dọc từ mép trên thanh dock, giới hạn `max-h-[calc(100dvh-120px)]`, giữ khoảng đệm an toàn tối thiểu 16px ở cả đỉnh màn hình và mép dock.
  * Ẩn thanh footer cồng kềnh `Xong & Đóng` trên mobile (`hidden sm:flex`), giải phóng ~70px diện tích màn hình.

---

## V. BẢNG MA TRẬN KẾ HOẠCH (ĐÃ LÀM - ĐANG LÀM - CHƯA LÀM)

| Tên Hạng Mục / Kế Hoạch | Trạng Thái | Mô Tả Chi Tiết & Kết Quả |
| :--- | :---: | :--- |
| **Kế hoạch 1**: Giỏ hàng Shopee & Phí ship tự động Maps | **ĐÃ HOÀN THÀNH** | Tích chọn từng hoa, bảng kê 4 tầng chi phí, tính km tự động từ 105 Doãn Kế Thiện, voucher, sổ địa chỉ 4 slot, form khách mua trực tiếp, khối tặng hoa hộ thu gọn. |
| **Kế hoạch 2**: Kho 54 mẫu hoa thật & Chuẩn hóa WebP | **ĐÃ HOÀN THÀNH** | 54 mẫu hoa thật (đúng 9 mẫu/danh mục), nén 100% sang WebP, sửa lỗi thụt lề padding-top các trang con không bị Marquee che khuất, xe giỏ hàng trắng phát sáng. |
| **Kế hoạch 2.1**: Trợ lý thời tiết nổi trang Admin & Tối ưu Popup | **ĐÃ HOÀN THÀNH** | Linh vật nổi kéo thả, tự mờ khi idle trên mobile, nhắc nhở chu kỳ 1 giờ bóng thoại kính mờ, accordion thu gọn phụ phí, tách 2 hàng giờ, căn giữa chuẩn, fix lỗi trắng trang `#owner`. |
| **Kế hoạch 3**: Bảo Mật Cấp 2 Cho Toàn Bộ Website | **CHƯA LÀM (CHỜ DUYỆT)** | Xác thực 2FA/OTP Email, khóa tài khoản khi nhập sai mã PIN quá 5 lần, mã hóa dữ liệu nhạy cảm, chống spam đơn hàng, session timeout. |
| **Kế hoạch 4**: Tích hợp Cổng thanh toán VietQR Webhook | **TƯƠNG LAI** | Kết nối Cassio / SeAPay Webhook nhận callback biến động số dư ngân hàng để tự động đổi trạng thái đơn sang "Đã Cọc 50%" không cần admin bấm tay. |
| **Kế hoạch 5**: Google Maps API Production | **TƯƠNG LAI** | Gắn Google Maps JavaScript & Distance Matrix API Key chính thức khi tiệm triển khai domain thực tế để định vị GPS trực tiếp của khách. |

---

## VI. KẾ HOẠCH TIẾP THEO: BẢO MẬT CẤP 2 TOÀN DIỆN (GIAI ĐOẠN 3)

Kế hoạch này **ĐANG Ở TRẠNG THÁI CHỜ LỆNH PHÊ DUYỆT** từ chủ tiệm trước khi viết bất kỳ dòng code nào.

### Các Hạng Mục Của Kế Hoạch Bảo Mật Cấp 2:
1. **Xác thực 2 Lớp (2FA / OTP)**:
   * Khi Super Admin hoặc Chủ Tiệm đăng nhập từ trình duyệt/thiết bị lạ, hệ thống yêu cầu mã OTP 6 số gửi về Email quản trị (`traivuho@gmail.com`).
   * Bắt buộc xác nhận OTP hoặc PIN cấp 2 đối với các hành động nhạy cảm: Xóa đơn hàng, xóa sản phẩm, sửa giá bán hoa, xuất toàn bộ dữ liệu khách hàng.
2. **Cơ chế Khóa Bảo Vệ Chống Dò Quét (Brute-Force Protection)**:
   * Giới hạn nhập sai mã PIN hoặc mật khẩu tối đa **5 lần**.
   * Nếu sai quá 5 lần, tạm khóa phiên đăng nhập trong **15 phút** và gửi cảnh báo đỏ về Email quản trị.
3. **Mã hóa Dữ liệu Nhạy Cảm (Client-Side Encryption)**:
   * Mã hóa số điện thoại khách hàng, sổ địa chỉ và thông tin đơn hàng trong `localStorage` bằng thuật toán AES/Base64 Obfuscation để tránh bị đọc trộm qua DevTools.
4. **Phân Quyền Chặt Chẽ Giữa Chủ Quán & Nhân Viên (RBAC Strict)**:
   * Nhân viên (`admin`): Chỉ được xem đơn, đổi trạng thái cắm hoa, giao hoa, xem bảng giá. Không được xem tổng doanh thu lãi/lỗ của tiệm, không được đổi thông tin ngân hàng VietQR.
   * Chủ tiệm (`owner`): Toàn quyền xem biểu đồ doanh thu, cấu hình tài khoản ngân hàng, phân quyền nhân viên.
5. **Cơ chế Tự Động Hết Hạn Phiên (Session Timeout)**:
   * Tự động đăng xuất tài khoản quản trị sau **30 phút** không có thao tác chuột hoặc bàn phím để phòng ngừa trường hợp quản trị viên quên khóa máy.
6. **Chống Spam Đặt Đơn Ảo (Rate Limiting & Anti-Spam)**:
   * Giới hạn mỗi địa chỉ IP / trình duyệt chỉ được tạo tối đa 3 đơn hoa trong vòng 10 phút nếu chưa thanh toán cọc.

---

## VII. DỮ LIỆU CẤU HÌNH & TÀI KHOẢN MẶC ĐỊNH

### 1. Tài Khoản Quản Trị Hệ Thống
* **Tài khoản Super Admin (Điều hành / Nhân viên)**:
  * Tên đăng nhập: `admin`
  * Mật khẩu: `17092000` (hoặc `admin123`)
  * Mã PIN vận hành: `26122025`
  * Đường dẫn truy cập nhanh: Thêm hash `#admin` trên URL (VD: `http://localhost:5174/#admin`).
* **Tài khoản Chủ Tiệm (Owner / Giám Đốc Toàn Quyền)**:
  * Tên đăng nhập: `vvflorielle` hoặc `chuquan`
  * Mật khẩu: `19092003` (hoặc `vvflorielle2026`)
  * Mã PIN bảo mật: `26122025`
  * Đường dẫn truy cập nhanh: Thêm hash `#owner` trên URL (VD: `http://localhost:5174/#owner`).
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

## VIII. QUY CHUẨN TÍNH CƯỚC SHIP & KHUNG GIỜ HOẠT ĐỘNG

### 1. Bảng Định Mức Cước Ship Tính Từ 105 Doãn Kế Thiện
Hệ thống sử dụng module [`src/data/hanoiLocations.ts`](file:///E:/V&VFlorielle/src/data/hanoiLocations.ts) để tính toán khoảng cách tọa độ chuẩn từ showroom:

| Khoảng Cách Tính Theo Maps | Mức Cước Tiêu Chuẩn | Ghi Chú Ưu Đãi |
| :--- | :---: | :--- |
| **Dưới 2.0 km** | **10.000 ₫** | Cùng phường Mai Dịch hoặc lân cận (Áp mã `FREESHIP30K` = 0₫) |
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
  * Thời gian: `11:30 - 13:00` (giờ nghỉ trưa) và `22:00 - 07:30` (đêm khuya & sáng sớm).
  * Quy tắc tự động: Hệ thống lấy thời gian đặt hàng thực tế + **35 phút chuẩn bị cắm hoa**. Nếu thời điểm giao hoa rơi vào khung giờ đặc biệt, hệ thống tự động cộng **+5.000₫ phụ phí ngoài giờ** và thông báo rõ ràng trong giỏ hàng cho khách hàng. Mức phí này Admin có thể đổi nhanh `+5k`, `+10k`, `+15k`, `+20k` trong Trợ lý thời tiết.

---

## IX. KIẾN TRÚC DỮ LIỆU STATE & KHÓA LƯU TRỮ LOCALSTORAGE

Dữ liệu của toàn bộ ứng dụng được quản lý qua `StoreContext` và lưu trữ cục bộ để duy trì dữ liệu liên tục:

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

## X. HƯỚNG DẪN THAO TÁC KỸ THUẬT, ĐẨY DỮ LIỆU & TRIỂN KHAI HOSTING

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
git commit -m "feat: complete master shopee cart, hanoi maps shipping, admin weather assistant, zero-WSOD owner modal, and master handover dossier"

# Đẩy mã nguồn lên nhánh chính (master)
git push origin master
```

### 4. Triển Khai Hosting Nhanh (100% Miễn Phí & Tối Ưu)

#### A. Triển khai lên Vercel
1. Cài đặt Vercel CLI: `npm i -g vercel`
2. Đăng nhập và triển khai:
   ```powershell
   vercel
   ```
3. Lưu ý: File `vercel.json` ở thư mục gốc (đã được cấu hình rewrite toàn bộ URL về `/index.html` để không bị lỗi 404 khi người dùng F5 tại các trang con).

#### B. Triển khai lên Netlify
1. Thư mục `public/_redirects` đã có sẵn nội dung:
   ```
   /*    /index.html   200
   ```
2. Kéo thả thư mục `dist/` trực tiếp vào trang quản trị Netlify Drop, website sẽ chạy ngay tức khắc với HTTPS miễn phí.

#### C. Triển khai lên Firebase Hosting
```powershell
npm i -g firebase-tools
firebase login
firebase init hosting
# Chọn thư mục public: dist
# Cấu hình Single Page App: Yes
firebase deploy --only hosting
```

---

## 🏁 LỜI KẾT & THÔNG ĐIỆP BÀN GIAO
Dự án **Tiệm Hoa Tươi Nghệ Thuật V&V Florielle** hiện tại đã đạt độ hoàn thiện cao, giao diện kính mờ đẳng cấp, đầy đủ nghiệp vụ từ giỏ hàng Shopee, tính cước km chính xác, trợ lý thời tiết thông minh đến phân hệ quản trị kép toàn diện.

Mọi người tiếp quản sau này chỉ cần đọc kỹ tài liệu này, tuân thủ nguyên tắc kỷ luật tại [Chương I](#i-quy-định--kỷ-luật-làm-việc-tối-cao-bắt-buộc-tuân-thủ) và tiếp tục thực hiện **Kế hoạch Bảo Mật Cấp 2** theo đúng lộ trình đã đề ra!
