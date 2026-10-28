# 🌸 V&V FLORIELLE - HỆ THỐNG WEB ĐẶT HOA & TÙY BIẾN CAO CẤP
*(Thiết kế Glassmorphism • Dual-Web Storefront & Admin • Sẵn sàng Deploy Cloudflare Pages + Render + Neon)*

Dự án được xây dựng hoàn thiện tại thư mục: `E:\hoatuoilinhphuong` (Tên thương hiệu: **V&V Florielle**)

---

## 1. CẤU TRÚC THƯ MỤC DỰ ÁN

```
E:\hoatuoilinhphuong/
├── frontend/                   # Web Khách (Storefront) & Web Admin (Chạy trên Cloudflare Pages)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # TrustBar (Hotline, cam kết), Navbar, Footer
│   │   │   ├── storefront/     # HeroBanner, ProductCard (Hiển thị mẫu hoa HD)
│   │   │   ├── pdp/            # ProductDetailModal (Zoom ảnh HD, Swatches giấy, Nơ, Thay hoa)
│   │   │   ├── checkout/       # GuestCheckoutModal (Đặt hàng nhanh không cần đăng nhập)
│   │   │   ├── tracking/       # OrderTrackingModal (Timeline tiến độ, Xem & Duyệt ảnh thật)
│   │   │   ├── admin/          # AdminPortal (Vé chế tác đơn hàng, Sửa giá, Tải ảnh duyệt)
│   │   │   └── mobile/         # MobileFrame (Khung điện thoại mô phỏng xem thử trên Desktop)
│   │   ├── services/api.js     # Kết nối RESTful API với Backend Render
│   │   ├── data/defaultData.js # Dữ liệu mẫu ban đầu
│   │   ├── index.css           # Hiệu ứng bóng kính Glassmorphism & Bộ đổi Theme
│   │   └── App.jsx             # Điều phối trung tâm
│   └── dist/                   # File build sẵn sàng deploy Cloudflare Pages
│
├── backend/                    # Backend API (Node.js/Express - Deploy lên Render.com)
│   ├── src/
│   │   ├── data/mockData.js    # Dữ liệu sản phẩm, đơn hàng, kho giấy & nơ
│   │   ├── db.js               # Kết nối Neon PostgreSQL (tự động fallback in-memory nếu chưa có DB)
│   │   └── server.js           # Express API + /api/health (chạm DB để giữ thức 24/24)
│   └── package.json
│
├── cloudflare-worker/          # Công cụ tự động đánh thức server (Keep-Alive Cron)
│   ├── worker.js               # Cron chạy mỗi 4 phút (Chỉ từ 05:00 - 24:00 giờ Việt Nam)
│   └── wrangler.toml           # Cấu hình Cloudflare Worker Cron Trigger
│
└── package.json                # Điều phối lệnh chạy local
```

---

## 2. HƯỚNG DẪN CHẠY DỰ ÁN TRÊN LOCAL (Ổ E)

### Cách 1: Khởi động Backend API (Port 5000)
Mở PowerShell tại thư mục dự án:
```powershell
cd E:\hoatuoilinhphuong\backend
npm start
```
* Server chạy tại: `http://localhost:5000`
* Test Healthcheck: `http://localhost:5000/api/health`

### Cách 2: Khởi động Frontend Web Khách & Admin (Port 3000)
Mở một cửa sổ PowerShell mới:
```powershell
cd E:\hoatuoilinhphuong\frontend
npm run dev
```
* Truy cập trên trình duyệt: `http://localhost:3000`

---

## 3. CÁC TÍNH NĂNG ĐẶC BIỆT ĐÃ HOÀN THIỆN

1. **Giao diện Bóng kính Glassmorphism:**
   * Hiệu ứng kính mờ bán trong suốt `backdrop-filter: blur(16px)` cao cấp.
   * Chuyển đổi 3 Theme màu dịu nhẹ tức thì: **Romance Rose** (Hồng phấn), **Botanic Sage** (Xanh sage tươi mát), **Sweet Lavender** (Tím oải hương).
2. **Trình xem Mẫu hoa có sẵn & Zoom ảnh HD (Deep Zoom):**
   * Rê chuột hoặc chạm tay vào ảnh sản phẩm để kích hoạt kính lúp phóng to xem độ tươi của từng cánh hoa.
   * Bóc tách thành phần minh bạch trong từng bó hoa (*Hồng Ohara, Cúc tana, Baby Hà Lan, Lá bạc...*).
3. **Bộ tùy biến trực tiếp trên mẫu hoa (Micro-Customizer):**
   * Bảng màu tròn (Swatches) chọn màu giấy gói: Trắng mờ sương, Hồng phấn pastel, Giấy Kraft vintage, Đen mờ Hàn Quốc, Xanh sage, Tím oải hương.
   * Chọn màu ruy băng/nơ: Satin Champagne, Lụa hồng, Voan đỏ rượu, Ruy băng in chữ chúc mừng.
   * Thêm/thay hoa: Thêm cành hồng cam Ohara (+60k), đổi baby sang baby hồng, thêm lá bạc.
   * Nút **AI Gợi ý câu chúc hay** tự động điền lời chúc thiệp theo dịp.
   * Giá tự động cập nhật nhảy số mượt mà theo từng lựa chọn.
4. **Đặt hàng Nhanh Không Cần Đăng Nhập (Guest Checkout):**
   * Khách chỉ cần điền tên, SĐT người nhận, địa chỉ, chọn giờ giao và bấm đặt.
   * Tùy chọn giao quà bí mật (che giá tiền, giấu tên người gửi).
   * Thanh toán VietQR tự động hoặc COD khi nhận hoa.
5. **Màn hình Tra Cứu Tiến Độ & Duyệt Ảnh Thành Phẩm (Photo Proof):**
   * Khách nhập mã đơn (vd: `DH-LP1082`) để xem thợ hoa đang cắm đến bước nào.
   * Khi thợ cắm xong, ảnh hoa thật xuất hiện tại đây để khách bấm **"Đồng ý giao ngay"** hoặc yêu cầu sửa qua Zalo.
6. **Màn hình Quản trị Admin riêng biệt (Admin Portal):**
   * Nút chuyển đổi nhanh ở góc trên bên phải hoặc truy cập độc lập.
   * Phát chuông báo và hiển thị ngay **"Vé chế tác đơn hàng (Florist Work Order)"** chi tiết công thức thợ cần cắm.
   * Công cụ **Sửa giá trực tiếp trên Web khách** mà không cần build lại.
   * Nút bấm **⚡ Tăng giá nhanh dịp Lễ (+20%)** cho toàn bộ mẫu hoa hồng dịp 14/2, 8/3, 20/10 chỉ trong 1 giây.
   * Nút chụp/tải ảnh hoa thật gửi khách duyệt.
7. **Khung điện thoại mô phỏng Mobile View:**
   * Cho phép trải nghiệm toàn diện phiên bản điện thoại với bố cục tối ưu 1 ngón tay, danh mục cuộn ngang và lưới 2 cột.

---

## 4. HƯỚNG DẪN DEPLOY LÊN CLOUD (CLOUDFLARE + RENDER + NEON)

### Bước 1: Deploy Database lên Neon.tech (Miễn phí)
1. Đăng ký tài khoản miễn phí tại [Neon.tech](https://neon.tech).
2. Tạo một Database mới (ví dụ: `hoatuoilinhphuong_db`).
3. Sao chép chuỗi kết nối PostgreSQL (Connection String), dạng:
   `postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/hoatuoilinhphuong_db?sslmode=require`

### Bước 2: Deploy Backend API lên Render.com (Miễn phí)
1. Đăng ký tại [Render.com](https://render.com).
2. Tạo một **New Web Service** trỏ đến repo GitHub của bạn.
3. Cấu hình:
   * **Root Directory:** `backend`
   * **Build Command:** `npm install`
   * **Start Command:** `node src/server.js`
   * **Environment Variables:**
     * `DATABASE_URL` = (Dán chuỗi kết nối Neon ở Bước 1 vào đây)
4. Bấm **Create Web Service**. Sau vài phút bạn sẽ nhận được link API: `https://hoatuoilinhphuong-api.onrender.com`.

### Bước 3: Deploy Frontend lên Cloudflare Pages (Miễn phí 100%)
1. Đăng nhập [dash.cloudflare.com](https://dash.cloudflare.com) ➔ Chọn **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
2. Chọn repo GitHub dự án của bạn.
3. Cấu hình build:
   * **Framework preset:** `Vite`
   * **Root directory:** `frontend`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
4. Bấm **Save and Deploy**. Web của bạn sẽ online ngay lập tức trên mạng lưới toàn cầu của Cloudflare với tốc độ dưới 1 giây và chứng chỉ SSL miễn phí!

### Bước 4: Kích hoạt Công cụ Tự Đánh Thức (Cloudflare Worker Cron)
Trong thư mục `cloudflare-worker/`:
1. Sửa URL trong `wrangler.toml` thành link API Render của bạn.
2. Chạy lệnh:
   ```bash
   npx wrangler deploy
   ```
3. Worker sẽ tự động ping mỗi 4 phút từ **05:00 đến 24:00 (giờ VN)** để giữ Render & Neon luôn hoạt động, và tự ngủ ban đêm để bảo toàn 100% hạn mức miễn phí 750 giờ/tháng!
