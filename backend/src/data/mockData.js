// Complete Catalog & Master Data for V&V Florielle Boutique

export const defaultProducts = [
  // 1. BÓ HOA SINH NHẬT & TÌNH YÊU
  {
    id: "VV-108",
    name: "Bó Hoa Ánh Dương Rực Rỡ",
    sku: "MS: VV-108",
    category: "Bó Hoa Sinh Nhật",
    basePrice: 650000,
    originalPrice: 750000,
    badge: "Bán Chạy Nhất",
    rating: 4.9,
    reviewsCount: 182,
    leadTime: "Giao nhanh 60-90 phút",
    description: "Tone màu vàng cam ấm áp như ánh bình minh, phối hợp giữa hồng kem Ohara nhập khẩu, cúc tana và baby trắng. Thích hợp tặng sinh nhật người yêu, bạn bè, đối tác hoặc chúc mừng thăng tiến.",
    images: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "10 cành Hồng Kem Ohara Ecuador cao cấp",
      secondaryFlowers: "Cúc Tana Hà Lan & Hoa Baby Trắng nhập khẩu",
      foliage: "Lá bạc Eucalyptus Silver Dollar thơm dịu",
      style: "Bó tròn sang trọng phong cách Hàn Quốc",
      size: "Đường kính ~45cm, Chiều cao ~60cm",
      care: "Cắt vát gốc 45 độ, thay nước sạch mỗi ngày, tránh để hoa trước luồng gió máy lạnh."
    },
    defaultPaper: "Trắng Mờ Sương",
    defaultRibbon: "Satin Champagne"
  },
  {
    id: "VV-201",
    name: "Bó Hồng Pastel Nàng Thơ",
    sku: "MS: VV-201",
    category: "Bó Hoa Sinh Nhật",
    basePrice: 580000,
    originalPrice: 680000,
    badge: "Mới Về",
    rating: 5.0,
    reviewsCount: 94,
    leadTime: "Giao nhanh 60 phút",
    description: "Sự kết hợp ngọt ngào giữa hồng kem dâu và baby hồng mộng mơ, mang vẻ đẹp thuần khiết dịu dàng của nàng thơ.",
    images: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "12 cành Hồng Kem Dâu Đà Lạt tuyển chọn",
      secondaryFlowers: "Baby Hồng nhập khẩu Hà Lan",
      foliage: "Lá bạc & Cỏ đồng tiền",
      style: "Bó lượn sóng pastel tiểu thư",
      size: "Đường kính ~40cm",
      care: "Tránh ánh nắng trực tiếp, xịt sương nhẹ lên cánh hoa vào buổi sáng sớm."
    },
    defaultPaper: "Hồng Phấn Pastel",
    defaultRibbon: "Lụa Hồng Pastel"
  },
  {
    id: "VV-203",
    name: "Bó Hoa Tulip Trắng Tinh Khôi",
    sku: "MS: VV-203",
    category: "Bó Hoa Tình Yêu",
    basePrice: 720000,
    originalPrice: 850000,
    badge: "Nhập Khẩu",
    rating: 4.8,
    reviewsCount: 78,
    leadTime: "Giao nhanh 60-90 phút",
    description: "10 cành Tulip trắng nhập khẩu trực tiếp Hà Lan, biểu tượng cho tình yêu chân thành, thanh lịch và không vụ lợi.",
    images: [
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "10 cành Tulip Trắng Hà Lan búp tươi",
      secondaryFlowers: "Hoa chuông trắng & cành cúc họa mi",
      foliage: "Lá tự nhiên của Tulip",
      style: "Bó dài tối giản phong cách Bắc Âu",
      size: "Chiều dài ~50cm",
      care: "Thêm vài viên đá lạnh vào bình nước cắm hoa để tulip giữ dáng tươi đứng lâu."
    },
    defaultPaper: "Trắng Mờ Sương",
    defaultRibbon: "Voan Trắng Tinh"
  },
  {
    id: "VV-206",
    name: "Bó 99 Đóa Hồng Đỏ Bất Diệt",
    sku: "MS: VV-206",
    category: "Bó Hoa Tình Yêu",
    basePrice: 1850000,
    originalPrice: 2200000,
    badge: "Siêu Phẩm",
    rating: 5.0,
    reviewsCount: 230,
    leadTime: "Chuẩn bị 2 giờ",
    description: "Bó hoa khổng lồ với 99 cành hồng đỏ Ecuador nhung thắm, tượng trưng cho tình yêu vĩnh cửu không bao giờ phai nhạt. Lựa chọn số 1 cho ngày cầu hôn, Valentine và kỷ niệm ngày cưới.",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "99 đóa Hồng Đỏ Red Naomi nhung nhung",
      secondaryFlowers: "Viền hoa Baby trắng Hà Lan nguyên bó",
      foliage: "Lá táo bạc trang trí",
      style: "Bó khổng lồ hoàng gia sang trọng",
      size: "Đường kính ~75cm, Chiều cao ~80cm",
      care: "Để nơi thoáng mát, phun nước dạng sương mịn giữ ẩm cho cánh hoa."
    },
    defaultPaper: "Đen Mờ Hàn Quốc",
    defaultRibbon: "Voan Đỏ Rượu"
  },

  // 2. HOA KHAI TRƯƠNG & SỰ KIỆN
  {
    id: "VV-202",
    name: "Kệ Hoa Khai Trương Phát Tài Phát Lộc",
    sku: "MS: VV-202",
    category: "Hoa Khai Trương",
    basePrice: 1250000,
    originalPrice: 1450000,
    badge: "Đại Cát",
    rating: 4.9,
    reviewsCount: 146,
    leadTime: "Giao hỏa tốc 2 giờ",
    description: "Kệ hoa đứng 2 tầng hoành tráng tone màu đỏ vàng may mắn, chúc cho gia chủ hồng phát, buôn may bán đắt, vạn sự hanh thông.",
    images: [
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "Hoa Đồng Tiền Đỏ, Hoa Hướng Dương & Lan Vàng",
      secondaryFlowers: "Hồng môn đỏ & Cẩm tú cầu xanh",
      foliage: "Lá cau kiểng, lá phát tài phong thủy",
      style: "Kệ đứng 2 tầng nghệ thuật kèm Banner in chữ lớn",
      size: "Chiều cao ~1.8m",
      care: "Thấm nước thường xuyên vào mút xốp cắm hoa ở mỗi tầng."
    },
    defaultPaper: "Đỏ May Mắn",
    defaultRibbon: "Đỏ Rượu In Chữ"
  },
  {
    id: "VV-207",
    name: "Lẵng Kệ Khai Trương Tone Cam Pastel Hiện Đại",
    sku: "MS: VV-207",
    category: "Hoa Khai Trương",
    basePrice: 1550000,
    originalPrice: 1800000,
    badge: "Trendy 2026",
    rating: 5.0,
    reviewsCount: 62,
    leadTime: "Giao trong 2 giờ",
    description: "Thiết kế bảng gỗ nghệ thuật phối hợp hoa hồng cam sa mạc, hồng môn nâu tây và lan hồ điệp, phong cách tối giản sang trọng theo xu hướng mới nhất.",
    images: [
      "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "Lan Hồ Điệp Trắng Nhụy Tím & Hồng Cam Sa Mạc",
      secondaryFlowers: "Cúc mẫu đơn cam nâu & Hoa phi yến",
      foliage: "Cành quạt khô & Lá bạc sấy mờ",
      style: "Kệ đứng khung sắt nghệ thuật kèm bảng tên UV",
      size: "Chiều cao ~1.75m",
      care: "Tưới nước ẩm vào xốp oasis mỗi sáng."
    },
    defaultPaper: "Trắng Mờ Sương",
    defaultRibbon: "Satin Champagne"
  },

  // 3. GIỎ HOA ĐỂ BÀN & HỘP HOA NGHỆ THUẬT
  {
    id: "VV-204",
    name: "Giỏ Hoa Mây Ban Mai Ngọt Ngào",
    sku: "MS: VV-204",
    category: "Giỏ Hoa Để Bàn",
    basePrice: 690000,
    originalPrice: 790000,
    badge: "Để Bàn",
    rating: 4.9,
    reviewsCount: 112,
    leadTime: "Giao nhanh 60 phút",
    description: "Giỏ mây tự nhiên đan tay cắm phối hợp hoa hồng, cát tường và cúc mẫu đơn, thích hợp để bàn làm việc hoặc phòng khách.",
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "Hồng Juliet, Cát tường xoắn & Cúc mẫu đơn",
      secondaryFlowers: "Hoa thanh liễu & hoa thạch thảo",
      foliage: "Lá đệm tùng nho",
      style: "Giỏ mây quai xách vintage",
      size: "Chiều cao ~38cm, ngang ~40cm",
      care: "Châm nửa ly nước vào giữa giỏ hoa mỗi ngày."
    },
    defaultPaper: "Giỏ Mây Tự Nhiên",
    defaultRibbon: "Satin Nâu Be"
  },
  {
    id: "VV-208",
    name: "Hộp Hoa Mica Trong Suốt Dạ Yến",
    sku: "MS: VV-208",
    category: "Giỏ Hoa Để Bàn",
    basePrice: 890000,
    originalPrice: 1050000,
    badge: "Tặng Đèn Led",
    rating: 4.9,
    reviewsCount: 88,
    leadTime: "Giao nhanh 60-90 phút",
    description: "Hộp hoa mica acrylic trong suốt thắt nơ lụa cao cấp, bên trong cắm hoa hồng đỏ và cúc tana kèm dây đèn led lấp lánh như bầu trời sao.",
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "15 cành Hồng Đỏ Pháp & Cúc Tana",
      secondaryFlowers: "Baby trắng & lá ngọc ngân",
      foliage: "Rêu xanh tự nhiên",
      style: "Hộp mica nắp mở sang trọng kèm đèn đom đóm",
      size: "25cm x 25cm x 30cm",
      care: "Hộp giữ ẩm kín, hoa tươi từ 4-6 ngày không cần tưới."
    },
    defaultPaper: "Hộp Mica Acrylic",
    defaultRibbon: "Voan Đỏ Rượu"
  },

  // 4. LAN HỒ ĐIỆP CAO CẤP
  {
    id: "VV-205",
    name: "Chậu Lan Hồ Điệp Phú Quý (5 Cành)",
    sku: "MS: VV-205",
    category: "Lan Hồ Điệp",
    basePrice: 1450000,
    originalPrice: 1650000,
    badge: "Cao Cấp",
    rating: 5.0,
    reviewsCount: 65,
    leadTime: "Giao trong ngày",
    description: "5 cành Lan Hồ Điệp tím đại cánh dày, cắm vào chậu sứ men ngọc cao cấp, mang vượng khí tài lộc và trường thọ.",
    images: [
      "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "5 cành Lan Hồ Điệp tím loại 1 (8-10 hoa/cành)",
      secondaryFlowers: "Cây dương xỉ đệm gốc & sen đá trang trí",
      foliage: "Cây tài lộc nhỏ & rêu rừng",
      style: "Chậu sứ trắng ngọc kèm nơ tài lộc",
      size: "Chiều cao ~85cm",
      care: "Tưới gốc 1 lần/tuần, không tưới lên cánh hoa, để nơi thoáng khí có ánh sáng tán xạ."
    },
    defaultPaper: "Chậu Sứ Men Ngọc",
    defaultRibbon: "Nơ Đỏ Gấm"
  },
  {
    id: "VV-209",
    name: "Thuyền Lan Hồ Điệp Hoàng Kim (9 Cành)",
    sku: "MS: VV-209",
    category: "Lan Hồ Điệp",
    basePrice: 2850000,
    originalPrice: 3200000,
    badge: "Vương Giả",
    rating: 5.0,
    reviewsCount: 42,
    leadTime: "Giao trong ngày",
    description: "9 cành Lan Hồ Điệp vàng rực rỡ uốn lượn trên chậu thuyền gốm mạ vàng, mang ý nghĩa cửu ngũ chí tôn, thuận buồm xuôi gió.",
    images: [
      "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "9 cành Lan Hồ Điệp Vàng Hoàng Hậu loại VIP",
      secondaryFlowers: "Tiểu cảnh sen đá, cỏ nhung tuyết",
      foliage: "Cành lũa tự nhiên tạo thế phong thủy",
      style: "Chậu thuyền gốm Bát Tràng tráng men vàng",
      size: "Chiều ngang ~90cm, Chiều cao ~1m",
      care: "Lan bền từ 4-8 tuần, giữ độ ẩm đất vừa phải."
    },
    defaultPaper: "Chậu Thuyền Gốm Hoàng Kim",
    defaultRibbon: "Nơ Lụa Vàng Đồng"
  },

  // 5. HOA TỐT NGHIỆP & CHÚC MỪNG
  {
    id: "VV-210",
    name: "Bó Hoa Hướng Dương Tương Lai Tươi Sáng",
    sku: "MS: VV-210",
    category: "Hoa Tốt Nghiệp",
    basePrice: 490000,
    originalPrice: 580000,
    badge: "Tặng Gấu Cử Nhân",
    rating: 4.9,
    reviewsCount: 156,
    leadTime: "Giao nhanh 60 phút",
    description: "Những bông hướng dương rực rỡ hướng về mặt trời kèm chú gấu bông đội nón cử nhân tốt nghiệp, chúc bạn vững bước trên con đường tương lai.",
    images: [
      "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "5 bông Hướng Dương Đà Lạt bông to tròn",
      secondaryFlowers: "Hoa cúc calimero & hoa thạch thảo trắng",
      foliage: "Lá chanh & lá bạc",
      style: "Bó tròn năng động kèm phụ kiện tốt nghiệp",
      size: "Đường kính ~40cm",
      care: "Cắt vát gốc cành hoa khi cắm vào bình nước sạch."
    },
    defaultPaper: "Giấy Báo Kraft Vintage",
    defaultRibbon: "Satin Champagne"
  },

  // 6. HOA CHIA BUỒN / TANG LỄ
  {
    id: "VV-211",
    name: "Kệ Hoa Tang Lễ Cõi Vĩnh Hằng (Tone Trắng Tím)",
    sku: "MS: VV-211",
    category: "Hoa Chia Buồn",
    basePrice: 1100000,
    originalPrice: 1300000,
    badge: "Trang Nghiêm",
    rating: 5.0,
    reviewsCount: 89,
    leadTime: "Giao gấp 90 phút",
    description: "Kệ hoa chia buồn phong cách trang nhã, kết hợp hoa cúc mẫu đơn trắng, lan thái trắng và cẩm tú cầu tím, thể hiện sự thành kính phân ưu và tiếc thương vô hạn.",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=85"
    ],
    components: {
      mainFlowers: "Lan Thái Trắng, Cúc Trắng & Cẩm Tú Cầu Tím",
      secondaryFlowers: "Hoa ly trắng thơm ngát & hồng trắng",
      foliage: "Lá cau, lá đệm xanh trang nghiêm",
      style: "Kệ đứng 2 tầng trang trọng kèm Băng Rôn Thành Kính Phân Ưu",
      size: "Chiều cao ~1.85m",
      care: "Shop hỗ trợ in băng rôn nhanh và giao tận nơi viếng tang lễ."
    },
    defaultPaper: "Trắng Mờ Sương",
    defaultRibbon: "Voan Trắng Tinh"
  }
];

export const defaultWrappingPapers = [
  { id: "wp-white", name: "Trắng Mờ Sương", colorHex: "#FFFFFF", price: 0 },
  { id: "wp-pink", name: "Hồng Phấn Pastel", colorHex: "#FBCFE8", price: 0 },
  { id: "wp-kraft", name: "Giấy Báo Kraft Vintage", colorHex: "#D7BA89", price: 0 },
  { id: "wp-black", name: "Đen Mờ Hàn Quốc", colorHex: "#334155", price: 0 },
  { id: "wp-sage", name: "Xanh Sage Trầm", colorHex: "#A7F3D0", price: 0 },
  { id: "wp-lavender", name: "Tím Oải Hương Nhạt", colorHex: "#E9D5FF", price: 0 }
];

export const defaultRibbons = [
  { id: "rb-champagne", name: "Satin Champagne", colorHex: "#FDE68A", price: 0 },
  { id: "rb-pink", name: "Lụa Hồng Pastel", colorHex: "#F472B6", price: 0 },
  { id: "rb-red", name: "Voan Đỏ Rượu", colorHex: "#DC2626", price: 0 },
  { id: "rb-white", name: "Voan Trắng Tinh", colorHex: "#FFFFFF", price: 0 },
  { id: "rb-custom-text", name: "Ruy Băng In Chữ Chúc Mừng", colorHex: "#E11D48", price: 25000 }
];

export const defaultAddons = [
  { id: "ad-roses-3", name: "Thêm 3 cành Hồng Cam Ohara nhập", price: 60000, type: "add" },
  { id: "ad-roses-5", name: "Thêm 5 cành Hồng Juliet Ecuador", price: 120000, type: "add" },
  { id: "ad-sub-baby-pink", name: "Đổi Baby Trắng sang Baby Hồng Nhập Khẩu", price: 0, type: "replace" },
  { id: "ad-sub-tana", name: "Đổi Baby sang Cúc Tana Hà Lan", price: 0, type: "replace" },
  { id: "ad-foliage-silver", name: "Thêm 1 nhánh Lá Bạc Eucalyptus to", price: 25000, type: "add" },
  { id: "ad-mini-bear", name: "Gấu Bông Tốt Nghiệp / Trái Tim Nhỏ", price: 45000, type: "gift" }
];

// Kho hoa lẻ phục vụ tính năng "Đặt hoa theo yêu cầu (Custom Flower Builder)"
export const looseFlowersInventory = [
  {
    id: "fl-rose-red",
    name: "Hồng Đỏ Red Naomi",
    color: "Đỏ nhung",
    colorHex: "#DC2626",
    unitPrice: 35000,
    unit: "cành",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80",
    inStock: true
  },
  {
    id: "fl-rose-ohara",
    name: "Hồng Kem Ohara Nhập Khẩu",
    color: "Kem phớt hồng",
    colorHex: "#FFE4E6",
    unitPrice: 40000,
    unit: "cành",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=200&q=80",
    inStock: true
  },
  {
    id: "fl-tulip-white",
    name: "Hoa Tulip Hà Lan",
    color: "Trắng tinh khôi",
    colorHex: "#F8FAFC",
    unitPrice: 45000,
    unit: "cành",
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=200&q=80",
    inStock: true
  },
  {
    id: "fl-sunflower",
    name: "Hướng Dương Đà Lạt",
    color: "Vàng rực rỡ",
    colorHex: "#F59E0B",
    unitPrice: 30000,
    unit: "bông",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=200&q=80",
    inStock: true
  },
  {
    id: "fl-baby-white",
    name: "Hoa Baby Hà Lan",
    color: "Trắng tuyết",
    colorHex: "#FFFFFF",
    unitPrice: 50000,
    unit: "bó nhỏ",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=200&q=80",
    inStock: true
  },
  {
    id: "fl-hydrangea-blue",
    name: "Cẩm Tú Cầu Xanh Lam",
    color: "Xanh pastel",
    colorHex: "#BFDBFE",
    unitPrice: 75000,
    unit: "cành lớn",
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=200&q=80",
    inStock: true
  },
  {
    id: "fl-orchid-yellow",
    name: "Lan Hồ Điệp Vàng",
    color: "Vàng hoàng yến",
    colorHex: "#FCD34D",
    unitPrice: 150000,
    unit: "cành 8 hoa",
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=200&q=80",
    inStock: true
  },
  {
    id: "fl-foliage-silver",
    name: "Lá Bạc Eucalyptus",
    color: "Xanh xám bạc",
    colorHex: "#CBD5E1",
    unitPrice: 25000,
    unit: "nhánh",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=200&q=80",
    inStock: true
  }
];

export const arrangementStyles = [
  { id: "st-round", name: "Bó Tròn Hàn Quốc", fee: 50000, desc: "Gói xòe tròn tiểu thư, phong cách lãng mạn hiện đại" },
  { id: "st-long", name: "Bó Dài Tối Giản", fee: 50000, desc: "Kiểu dáng thanh thoát phong cách Bắc Âu" },
  { id: "st-basket", name: "Giỏ Mây Cầm Tay", fee: 80000, desc: "Giỏ mây đan tự nhiên, thích hợp để bàn" },
  { id: "st-box", name: "Hộp Hoa Mica Trong Suốt", fee: 120000, desc: "Hộp acrylic cao cấp kèm đèn led" },
  { id: "st-stand", name: "Lẵng Kệ Khai Trương 2 Tầng", fee: 180000, desc: "Kệ sắt đứng cao 1.8m hoành tráng" }
];

export const initialOrders = [
  {
    id: "DH-VV1082",
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    status: "preparing",
    productId: "VV-108",
    productName: "Bó Hoa Ánh Dương Rực Rỡ",
    productSku: "MS: VV-108",
    productImage: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80",
    totalPrice: 710000,
    recipe: {
      wrappingPaper: "Trắng Mờ Sương",
      ribbon: "Satin Champagne",
      addons: ["Thêm 3 cành Hồng Cam Ohara nhập"],
      notes: "Hoa nở vừa tầm, chọn bông tươi nhất giúp mình."
    },
    card: {
      message: "Chúc mừng sinh nhật công chúa nhỏ của anh! Mãi rạng ngời và hạnh phúc em nhé ❤️",
      bannerText: "HPBD THÙY LINH"
    },
    delivery: {
      timeSlot: "Chiều nay (16:30 - 17:30)",
      receiverName: "Nguyễn Thùy Linh",
      receiverPhone: "0912.888.345",
      address: "Tầng 12, Tòa nhà Bitexco, Số 2 Hải Triều, P. Bến Nghé, Quận 1, TP.HCM",
      secretGift: false
    },
    customer: {
      name: "Trần Văn Nam",
      phone: "0903.111.890",
      notes: "Gọi trước khi giao 15 phút, gửi ảnh hoa thật qua Zalo trước giúp mình."
    },
    payment: {
      method: "VietQR (Đã thanh toán)",
      status: "paid"
    },
    finishedPhotos: []
  }
];

export const initialProducts = defaultProducts;
export const wrappingPapers = defaultWrappingPapers;
export const ribbons = defaultRibbons;
export const availableAddons = defaultAddons;
