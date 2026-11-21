# BÁO CÁO RÀ SOÁT TOÀN DIỆN GIAO DIỆN WEBSITE (MOBILE & TABLET)
**Dự án:** V&V Florielle Boutique  
**Thời gian rà soát:** 21/11/2026  
**Phạm vi:** Toàn bộ giao diện từ storefront bên ngoài đến trang quản trị bên trong, tập trung chuyên sâu vào các kích thước màn hình Mobile (< 640px) và Tablet (640px – 1024px).

---

## I. TỔNG QUAN KẾT QUẢ RÀ SOÁT

Sau khi rà soát chi tiết từng trang, từng nút chức năng và từng khối bố cục, hệ thống hoạt động ổn định và logic nghiệp vụ chính xác. Tuy nhiên, đúng như nhận định của bạn, **tồn tại nhiều hàng nút chức năng đang bị ép thành 1 hàng đơn lẻ với thanh cuộn ngang (`overflow-x-auto whitespace-nowrap`)**. 

Khi người dùng mở trên điện thoại (iPhone, Samsung) hoặc máy tính bảng:
* Các nút bấm quan trọng ở phía sau (như *Đang giao, Hoàn thành, Đã hủy, Đã duyệt cọc, Hết hạn, Đã ẩn*) bị đẩy khuất ra ngoài rìa màn hình.
* Người dùng bắt buộc phải dùng ngón tay kéo vuốt ngang qua lại mới thấy và bấm được, khiến giao diện nhìn bị cụt, thiếu chuyên nghiệp và giảm tốc độ thao tác của thợ cắm hoa lẫn chủ tiệm.

---

## II. DANH SÁCH CHI TIẾT CÁC ĐIỂM CẦN NÂNG CẤP HOÀN THIỆN

### PHẦN 1: TRANG QUẢN TRỊ (ADMIN DASHBOARD & CÁC SUBPAGE)
*(Khu vực trọng tâm cần xử lý)*

#### 1. Quản lý Đơn hàng (`OrdersSubpage.tsx`)
* **Vấn đề 1 (Hàng lọc tiến độ đơn - Dòng 1086):** Đang có 7 nút (*Tất cả, Chờ duyệt kho, Chờ cọc 50%, Đang cắm, Đang giao, Hoàn thành, Đã hủy*) nằm trên 1 hàng cuộn ngang. Trên điện thoại chỉ nhìn thấy 2-3 nút đầu, các nút như *Đang giao, Hoàn thành* bị giấu khuất.
  * **Giải pháp:** Chuyển thành **2 hàng cân đối (Zero-scroll)**. Hàng 1 gồm 4 nút đầu quy trình (*Tất cả, Chờ duyệt kho, Chờ cọc, Đang cắm*); Hàng 2 gồm 3 nút kết quả (*Đang giao, Hoàn thành, Đã hủy*).
* **Vấn đề 2 (Hàng lọc cọc VietQR - Dòng 1168):** Đang có 4 nút (*Tất cả trạng thái cọc, Chờ duyệt cọc, Đã duyệt cọc, Cọc bị từ chối*) bị cuộn ngang.
  * **Giải pháp:** Bố trí dạng lưới 2x2 hoặc 2 hàng co giãn linh hoạt, nhìn thấy ngay số lượng đơn chờ duyệt cọc mà không cần vuốt.
* **Vấn đề 3 (Thanh thao tác trên cùng - Dòng 1042):** Ô tìm kiếm đơn hàng + nút *Xuất CSV* + nút *Kho Ảnh & Drive* trên màn hình hẹp (< 390px) bị dồn ép lệch hàng.
  * **Giải pháp:** Ô tìm kiếm chiếm trọn 100% bề rộng hàng 1; 2 nút thao tác chia đều hàng 2.

---

#### 2. Quản lý Khuyến mãi & Voucher (`PromotionsSubpage.tsx`)
* **Vấn đề (Thanh Tab phân loại Voucher - Dòng 209):** Đang có 6 tab (*Tất cả, Công khai web, Mã ẩn/Sinh nhật, Theo mẫu hoa, Theo danh mục, Hết hạn*) ép trên 1 hàng cuộn ngang.
  * **Giải pháp:** Tổ chức thành **2 hàng nút gọn gàng**:
    * Hàng 1 (Voucher chính): *Tất cả*, *Công khai web*, *Mã ẩn/Sinh nhật*.
    * Hàng 2 (Theo điều kiện): *Theo mẫu hoa*, *Theo danh mục*, *Hết hạn*.

---

#### 3. Quản lý Đánh giá của Khách (`ReviewsSubpage.tsx`)
* **Vấn đề (Tab trạng thái duyệt đánh giá - Dòng 259):** Đang có 4 tab (*Tất cả, Chờ duyệt, Đang hiển thị, Đã ẩn*) nằm trên 1 hàng `overflow-x-auto`. Trên điện thoại, nút *Đã ẩn* bị tràn mép phải.
  * **Giải pháp:** Chia thành lưới 2x2 trên mobile (`grid grid-cols-2 gap-2`), trên tablet/desktop giữ nguyên hàng ngang rộng rãi.

---

#### 4. Bàn Làm Việc Tổng Quan (`ManagementFunctionalGrid.tsx`)
* **Vấn đề (Thanh phân loại 6 phân khu trên mobile - Dòng 69):** Đang có 6 nút phân khu nhanh (*Tất cả, Bán Hàng & Vận Hành, Khách Hàng & Nhân Sự, Báo Cáo & Tài Chính, Giao Diện & Thương Hiệu, Hệ Thống & Bảo Mật*) ép 1 hàng cuộn ngang.
  * **Giải pháp:** Chuyển thành **2 hàng (mỗi hàng 3 nút) dạng thẻ bo góc chạm êm ái**, giúp chủ tiệm bấm chuyển phân khu quản lý trong 1 chạm.

---

#### 5. Quản lý Khách hàng & Hội viên (`CustomersSubpage.tsx`)
* **Vấn đề (Cụm lọc hạng thành viên & trạng thái - Dòng 195):** Hàng 5 nút hạng (*Tất cả, Thành viên mới, Bạc, Vàng, Kim Cương*) và hàng trạng thái (*Hoạt động, Tạm khóa, Ẩn danh*) khi hiển thị trên mobile đôi khi bị gãy dòng không đều.
  * **Giải pháp:** Định dạng thành 2 hàng phân cấp rõ ràng: Hàng 1 lọc Hạng VIP (5 nút chia đều hoặc tự co giãn mượt mà); Hàng 2 lọc Trạng thái tài khoản.

---

#### 6. Báo cáo Doanh thu & Dòng tiền (`RevenueSubpage.tsx`)
* **Vấn đề (Cụm chọn thời gian nhanh & phương thức thanh toán - Dòng 300):** 6 nút chọn mốc thời gian (*Hôm nay, Hôm qua, 7 ngày, Tháng này, Tháng trước, Tùy chọn*) + 3 nút phương thức (*Tất cả, VietQR, Tiền mặt*) trên tablet/mobile nằm lẫn lộn gây dài trang.
  * **Giải pháp:** Tách rõ 2 khối: Khối chọn mốc thời gian 2 hàng đối xứng; Khối phương thức thanh toán dạng nút chuyển tab 3 nấc gọn gàng.

---

### PHẦN 2: GIAO DIỆN KHÁCH HÀNG BÊN NGOÀI (STOREFRONT - MOBILE & TABLET)

#### 1. Trang Bộ Sưu Tập Mẫu Hoa (`CatalogPage.tsx`)
* **Vấn đề (Thanh chọn danh mục hoa - Dòng 133):** Thanh chọn danh mục hoa (*Tất cả, Khai trương, Sinh nhật, Tình yêu, Lan hồ điệp, Chia buồn...*) đang dùng 1 hàng cuộn ngang `overflow-x-auto`.
* *(Lưu ý: Tại Trang chủ thì đã làm `flex-wrap` nhiều hàng rất đẹp, nhưng trang Catalog riêng lại vẫn dùng thanh cuộn ngang cũ)*.
  * **Giải pháp:** Đồng bộ hóa sang dạng **2 hàng viên thuốc (Pill tabs)** giống hệt Trang chủ để khách xem trọn vẹn các chủ đề hoa ngay khi vừa mở trang.

---

#### 2. Cổng Thông Tin Thành Viên & Tra Cứu Đơn (`CustomerOrdersTab.tsx`)
* **Vấn đề (Thanh lọc trạng thái đơn của khách - Dòng 44):** Khách hàng vào tra cứu đơn trên điện thoại chỉ thấy 2 nút *Tất cả*, *Chờ duyệt kho*, còn các nút *Chờ cọc 50%, Đang cắm hoa, Đang giao, Đã hoàn tất* bị khuất ngang bên phải.
  * **Giải pháp:** Chuyển thành **2 hàng nút bấm** (Hàng 1: Đơn đang xử lý; Hàng 2: Đơn đang giao & hoàn tất) để khách hàng dễ dàng theo dõi hành trình đơn hoa của mình.

---

#### 3. Modal Xem Tất Cả Đánh Giá (`CustomerReviewsSection.tsx` - Dòng 915)
* **Vấn đề:** Khung lọc sao (Tất cả, 5 sao, 4 sao, 3 sao, có ảnh...) trong popup đánh giá đang bị cuộn ngang.
  * **Giải pháp:** Cho tự động rớt 2 hàng gọn gàng bên trong header của popup.

---

#### 4. Chân Trang Website (`Footer.tsx` - Dòng 106)
* **Vấn đề:** Cụm 3 khối thông tin (*Thông tin tiệm, Danh mục hoa, Quét mã VietQR*) đang để `grid-cols-3` trên mọi màn hình. Trên các dòng điện thoại nhỏ (< 375px như iPhone SE), mỗi cột bị ép hẹp chỉ còn ~100px khiến chữ bị co lại rất nhỏ (`text-[8px]`).
  * **Giải pháp:** Trên màn hình rất nhỏ (< 400px), tự động xếp chồng dạng 1 cột hoặc 2 cột linh hoạt để chữ to rõ, dễ đọc hơn.

---

## III. NGUYÊN TẮC THIẾT KẾ & HƯỚNG TRIỂN KHAI (ZERO-SCROLL)

1. **Chuẩn Zero-Scroll 2 hàng:**
   * Không còn tình trạng người dùng phải vuốt ngang để tìm nút trên điện thoại.
   * Tất cả nút bấm đều hiển thị trực quan ngay trước mắt, có badge số lượng rõ ràng.
2. **Kích thước chạm chuẩn ngón tay (Touch Target):**
   * Chiều cao nút từ **34px đến 40px**, khoảng cách giữa các nút từ **6px đến 8px**, bấm nhẹ nhàng không bị chạm nhầm.
3. **Thích ứng màn hình đa tầng (Responsive Breakpoints):**
   * **Mobile (< 640px):** 2 hàng nút chức năng khoa học, không cuộn ngang.
   * **Tablet (640px – 1024px):** Tự động dàn đều hoặc 2 hàng thoáng đãng.
   * **Desktop (> 1024px):** Giữ nguyên hàng ngang tiêu chuẩn sang trọng, không làm ảnh hưởng tới trải nghiệm máy tính.
4. **Bảo toàn dữ liệu & An toàn mã nguồn:**
   * **Tuyệt đối tuân thủ RULE 1:** Không can thiệp hay sửa đổi file `src/components/Header.tsx`.
   * Giữ nguyên vẹn 100% 54 mẫu hoa tươi và cấu trúc bảng giá.

---

## IV. BẢNG TỔNG HỢP CÁC FILE CẦN THI CÔNG

| TT | File thành phần | Vị trí màn hình | Tình trạng hiện tại | Hướng xử lý nâng cấp |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `OrdersSubpage.tsx` | Quản lý Đơn hàng | 1 hàng cuộn ngang (7 nút tiến độ + 4 nút cọc) | Tối ưu thành 2 hàng Zero-scroll + Search/CSV 2 hàng |
| **2** | `PromotionsSubpage.tsx` | Quản lý Khuyến mãi | 1 hàng cuộn ngang 6 tab voucher | Tách 2 hàng: Voucher chính & Điều kiện áp dụng |
| **3** | `ReviewsSubpage.tsx` | Quản lý Đánh giá | 1 hàng cuộn ngang 4 tab trạng thái | Chuyển thành lưới 2x2 cân xứng trên mobile |
| **4** | `ManagementFunctionalGrid.tsx` | Bàn làm việc tổng quan | 1 hàng cuộn ngang 6 phân khu | Chuyển thành 2 hàng (mỗi hàng 3 phân khu lớn) |
| **5** | `CustomersSubpage.tsx` | Quản lý Hội viên | 2 hàng lọc hạng và trạng thái bị xô lệch | Căn chỉnh 2 hàng phân cấp thẳng hàng, đều nhịp |
| **6** | `RevenueSubpage.tsx` | Báo cáo Tài chính | Toolbar mốc thời gian và thanh toán bị dài | Nhóm 2 hàng: Thời gian nhanh & Phương thức trả |
| **7** | `CatalogPage.tsx` | Bộ sưu tập hoa ngoài web | 1 hàng cuộn ngang danh mục hoa | Chuyển thành 2 hàng Pill tabs tự co giãn như Home |
| **8** | `CustomerOrdersTab.tsx` | Cổng khách tra cứu đơn | 1 hàng cuộn ngang 6 tab tiến độ | Chuyển thành 2 hàng nút bấm trực quan |
| **9** | `CustomerReviewsSection.tsx` | Popup đánh giá ngoài web | Thanh lọc sao bị cuộn ngang | Cho tự động rớt 2 hàng gọn gàng trong popup |
| **10**| `Footer.tsx` | Chân trang website | 3 cột bị ép chật trên điện thoại nhỏ (<375px) | Responsive co giãn mượt mà theo kích thước màn hình |
