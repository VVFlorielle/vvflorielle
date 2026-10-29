import {
  FlowerCategory,
  FlowerProduct,
  Order,
  CustomerUser,
  ShopSettings,
  PromotionItem,
  BlogArticle,
  HeroBannerConfig,
  ContactChannel,
  MarqueeItem
} from '../types';

export const INITIAL_CATEGORIES: FlowerCategory[] = [
  {
    id: 'all',
    name: 'Tất cả mẫu hoa',
    icon: 'Sparkles',
    description: 'Bộ sưu tập hoa tươi mới nhất hôm nay tại 105 Doãn Kế Thiện',
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Tuyển tập hơn 100+ thiết kế hoa tươi tinh xảo'
  },
  {
    id: 'khai-truong',
    name: 'Hoa Khai Trương',
    icon: 'Trophy',
    description: 'Kệ hoa 2-3 tầng, lẵng hoa mang ý nghĩa phát tài hồng phát',
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Hồng Phát Vạn Sự Hanh Thông • Tặng Kèm Banner In Thiết Kế'
  },
  {
    id: 'sinh-nhat',
    name: 'Hoa Sinh Nhật',
    icon: 'Gift',
    description: 'Mẫu bó hoa, giỏ hoa mây tươi tắn dành tặng người thân yêu',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Món Quà Ngọt Ngào • Miễn Phí Thiệp Viết Tay Ý Nghĩa'
  },
  {
    id: 'tinh-yeu',
    name: 'Hoa Tình Yêu',
    icon: 'Heart',
    description: 'Hồng đỏ Ecuador, hoa lãng mạn cho các dịp kỷ niệm',
    imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Trao Lời Yêu Thương Say Đắm • Nơ Ruy Băng Lụa Cao Cấp'
  },
  {
    id: 'lan-ho-diep',
    name: 'Lan Hồ Điệp',
    icon: 'Crown',
    description: 'Chậu lan hồ điệp tuyển chọn sang trọng, cánh dày tươi lâu',
    imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Đẳng Cấp Vương Giả • Chậu Sứ Men Trắng Tinh Tế'
  },
  {
    id: 'chuc-mung',
    name: 'Hoa Chúc Mừng',
    icon: 'Smile',
    description: 'Chúc mừng sự kiện, tốt nghiệp, thăng chức, ngày lễ',
    imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Tươi Trẻ Năng Động • Thiết Kế Theo Yêu Cầu Riêng'
  },
  {
    id: 'chia-buon',
    name: 'Hoa Chia Buồn',
    icon: 'Feather',
    description: 'Vòng hoa, kệ hoa kính viếng trang nghiêm lịch sự',
    imageUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Thành Kính Phân Ưu • Giao Gấp Trong 2 Giờ Kính Viếng'
  }
];

export const INITIAL_PRODUCTS: FlowerProduct[] = [
  {
    id: 'fl-01',
    name: 'Kệ Hoa Khai Trương Phú Quý Thịnh Vượng (2 Tầng)',
    categoryId: 'khai-truong',
    price: 1350000,
    originalPrice: 1550000,
    tag: 'Bán chạy',
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['Hoa hướng dương Đà Lạt', 'Lan vũ nữ vàng', 'Hồng môn đỏ', 'Lá cau phụ kiện'],
    description: 'Thiết kế 2 tầng hoành tráng, phối tone vàng đỏ rực rỡ tượng trưng cho khởi đầu hồng phát, vạn sự hanh thông và tài lộc dồi dào.',
    meaning: 'Chúc mừng gia chủ buôn may bán đắt, phát tài phát lộc bền lâu.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
      accent: '#ca8a04',
      tagBg: '#eab308'
    },
    isAvailable: true,
    rating: 5.0,
    reviewCount: 38,
    relatedProductIds: ['fl-02', 'fl-05']
  },
  {
    id: 'fl-02',
    name: 'Lẵng Hoa Khai Trương Tài Lộc Vàng Kim Để Bàn',
    categoryId: 'khai-truong',
    price: 680000,
    originalPrice: 750000,
    tag: 'Mới',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['Hoa hồng Juliet vàng', 'Cát tường xanh bơ', 'Cúc mẫu đơn cam', 'Lá bạc khuynh diệp'],
    description: 'Dạng lẵng gỗ tự nhiên nhỏ gọn sang trọng, thích hợp đặt quầy lễ tân hoặc bàn tiếp khách trong ngày khai trương.',
    meaning: 'Hút tài lộc, vượng khí cho không gian kinh doanh mới.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
      accent: '#ea580c',
      tagBg: '#f97316'
    },
    isAvailable: true,
    rating: 4.9,
    reviewCount: 24,
    relatedProductIds: ['fl-01', 'fl-09']
  },
  {
    id: 'fl-03',
    name: 'Bó Hoa Hồng Ecuador Đỏ Say Đắm (Chân Ái)',
    categoryId: 'tinh-yeu',
    price: 850000,
    originalPrice: 950000,
    tag: 'Hot',
    imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['Hồng đỏ Ecuador bông to', 'Hoa baby trắng Hà Lan', 'Giấy gói đen mờ cao cấp'],
    description: 'Tuyển chọn những bông hồng đỏ nhập khẩu size đại với cánh hoa nhung dày mịn, hương thơm dịu nhẹ quyến rũ khó quên.',
    meaning: 'Tình yêu nồng cháy, bất diệt và duy nhất dành tặng người đặc biệt.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)',
      accent: '#e11d48',
      tagBg: '#f43f5e'
    },
    isAvailable: true,
    rating: 5.0,
    reviewCount: 62,
    relatedProductIds: ['fl-07', 'fl-11']
  },
  {
    id: 'fl-04',
    name: 'Giỏ Hoa Pastel Dịu Ngọt - Nắng Mới Cầu Giấy',
    categoryId: 'sinh-nhat',
    price: 680000,
    originalPrice: 790000,
    tag: 'Bán chạy',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['Hồng kem dâu', 'Cát tường trắng viền hồng', 'Hoa thanh liễu', 'Cúc calimero'],
    description: 'Tông màu pastel dịu dàng nữ tính cắm trong giỏ mây đan thủ công, thắt nơ ruy băng lụa mềm mại cực kỳ tôn dáng.',
    meaning: 'Chúc tuổi mới luôn tươi trẻ, bình an và rạng ngời hạnh phúc.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
      accent: '#db2777',
      tagBg: '#ec4899'
    },
    isAvailable: true,
    rating: 4.9,
    reviewCount: 45,
    relatedProductIds: ['fl-10', 'fl-07']
  },
  {
    id: 'fl-05',
    name: 'Chậu Lan Hồ Điệp Đại Hoàng Kim (5 Cành Sứ Trắng)',
    categoryId: 'lan-ho-diep',
    price: 1650000,
    originalPrice: 1850000,
    tag: 'Hot',
    imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['5 cành Lan hồ điệp vàng hoàng hậu', 'Cây cọ nhỏ phong thủy', 'Chậu sứ Bát Tràng cao cấp'],
    description: 'Hoa nở đều bông, từ 8-10 hoa/cành, cánh dày mỡ màng, bền đẹp kéo dài từ 4 đến 8 tuần.',
    meaning: 'Biểu tượng của sự vương giả, tài lộc sum vầy và phúc khí an khang.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
      accent: '#a16207',
      tagBg: '#ca8a04'
    },
    isAvailable: true,
    rating: 5.0,
    reviewCount: 29,
    relatedProductIds: ['fl-01', 'fl-06']
  },
  {
    id: 'fl-06',
    name: 'Chậu Lan Hồ Điệp Bạch Ngọc Tinh Khôi (3 Cành)',
    categoryId: 'lan-ho-diep',
    price: 1050000,
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['3 cành Lan hồ điệp trắng họng vàng', 'Rêu rừng xanh trang trí', 'Nơ lụa ngọc bích'],
    description: 'Vẻ đẹp thanh tao, thuần khiết phù hợp đặt tại phòng khách, sảnh văn phòng hoặc làm quà biếu đối tác ngoại giao.',
    meaning: 'Tượng trưng cho sự khởi đầu tốt đẹp, chân thành và cao quý.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      accent: '#334155',
      tagBg: '#475569'
    },
    isAvailable: true,
    rating: 4.8,
    reviewCount: 19,
    relatedProductIds: ['fl-05', 'fl-08']
  },
  {
    id: 'fl-07',
    name: 'Bó Hoa Baby Trắng Tinh Khôi Mộng Mơ',
    categoryId: 'tinh-yeu',
    price: 450000,
    tag: 'Mới',
    imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['Hoa baby trắng nhập khẩu 100%', 'Giấy gói đen mờ cá tính', 'Ruy băng satin'],
    description: 'Bó hoa to tròn như đám mây trắng bồng bềnh, giữ khô được 1-2 năm làm hoa khô lưu niệm xinh xắn.',
    meaning: 'Tình yêu thuần khiết, trong trẻo và chân thành không toan tính.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      accent: '#0f172a',
      tagBg: '#1e293b'
    },
    isAvailable: true,
    rating: 4.9,
    reviewCount: 42,
    relatedProductIds: ['fl-03', 'fl-11']
  },
  {
    id: 'fl-08',
    name: 'Kệ Hoa Viếng Thành Kính Chia Buồn (Trắng Tím)',
    categoryId: 'chia-buon',
    price: 1100000,
    imageUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['Lan trắng Thái Lan', 'Cúc vàng đại đóa', 'Hoa ly trắng', 'Lá cau phong thủy'],
    description: 'Kệ hoa 2 tầng trang trọng, nhã nhặn, thể hiện lòng tiếc thương vô hạn và niềm an ủi chân thành gửi đến gia quyến.',
    meaning: 'Cầu chúc người ra đi thanh thản về cõi vĩnh hằng.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      accent: '#7c3aed',
      tagBg: '#6d28d9'
    },
    isAvailable: true,
    rating: 5.0,
    reviewCount: 15,
    relatedProductIds: ['fl-06']
  },
  {
    id: 'fl-09',
    name: 'Bó Hoa Tulip Hà Lan Mùa Xuân Nắng Ấm',
    categoryId: 'chuc-mung',
    price: 780000,
    tag: 'Mới',
    imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['10 cành Tulip vàng cam', 'Hoa phụ kiện', 'Giấy xi măng vintage'],
    description: 'Tulip nhập khẩu trực tiếp từ Hà Lan, thân cành mọng nước, hé nở đẹp tự nhiên trong 4-7 ngày.',
    meaning: 'Tượng trưng cho sự may mắn, lời chúc thành công và khởi đầu thuận lợi.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #fef9c3 0%, #ffedd5 100%)',
      accent: '#eab308',
      tagBg: '#ca8a04'
    },
    isAvailable: true,
    rating: 5.0,
    reviewCount: 22,
    relatedProductIds: ['fl-02', 'fl-04']
  },
  {
    id: 'fl-10',
    name: 'Bó Hoa Cúc Mẫu Đơn Hồng Khổng Lồ (Peony Mix)',
    categoryId: 'sinh-nhat',
    price: 950000,
    tag: 'Hot',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['5 đóa Mẫu đơn hồng nhập khẩu', 'Hoa cẩm chướng pastel', 'Lá tai lừa'],
    description: 'Bông to đường kính 12-15cm, cánh xếp lớp gợn sóng tuyệt mỹ, hương thơm nồng nàn quyến rũ.',
    meaning: 'Sự vương giả, thịnh vượng, sắc đẹp thanh xuân và tình duyên viên mãn.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
      accent: '#db2777',
      tagBg: '#be185d'
    },
    isAvailable: true,
    rating: 5.0,
    reviewCount: 36,
    relatedProductIds: ['fl-04', 'fl-03']
  },
  {
    id: 'fl-11',
    name: 'Bó Hoa Cẩm Tú Cầu Xanh Biển Hy Vọng',
    categoryId: 'tinh-yeu',
    price: 580000,
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    flowerTypes: ['3 cầu Cẩm tú cầu xanh', 'Hoa thạch thảo trắng', 'Lá bạc khuynh diệp'],
    description: 'Những cánh hoa nhỏ li ti kết thành khối cầu tròn đầy đặn như những ước mơ đong đầy yêu thương.',
    meaning: 'Lòng biết ơn, sự thấu hiểu chân thành và sự gắn kết bền chặt.',
    gradientTheme: {
      bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      accent: '#0284c7',
      tagBg: '#0369a1'
    },
    isAvailable: true,
    rating: 4.9,
    reviewCount: 18,
    relatedProductIds: ['fl-07', 'fl-03']
  }
];

export const INITIAL_SHOP_SETTINGS: ShopSettings = {
  name: 'V&V Florielle',
  slogan: 'Boutique Florist & Hoa Tươi Thiết Kế Cầu Giấy Hà Nội',
  hotline: '0906.721.442',
  zalo: '0906.721.442',
  address: '105 Doãn Kế Thiện, Cầu Giấy, Hà Nội',
  email: 'vvflorielle@gmail.com',
  openingHours: '06:30 - 21:30 (Mở cửa tất cả các ngày)',
  bankName: 'Vietcombank (Ngân hàng Ngoại Thương)',
  bankAccount: '1029384756',
  bankHolder: 'V&V FLORIELLE',
  freeShipThreshold: 500000,
  standardShipFee: 20000,
  shippingFeePerKm: 10000,
  warnDeliveryRadiusKm: 20,
  maxDeliveryRadiusKm: 50,
  customDomain: 'https://vvflorielle.vn',
  voiceAlertsEnabled: true,
  autoApproveWaitMinutes: 2
};

export const INITIAL_CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'channel-zalo',
    type: 'zalo',
    label: 'Chat Zalo Tư Vấn Nhanh',
    value: '0906.721.442',
    link: 'https://zalo.me/0906721442',
    iconColor: '#0068ff',
    badge: 'Online',
    isEnabled: true,
    order: 1
  },
  {
    id: 'channel-hotline',
    type: 'hotline',
    label: 'Hotline Đặt Hoa 24/7',
    value: '0906.721.442',
    link: 'tel:0906721442',
    iconColor: '#e11d48',
    badge: 'Gọi ngay',
    isEnabled: true,
    order: 2
  },
  {
    id: 'channel-tiktok',
    type: 'tiktok',
    label: 'TikTok Video Hoa Thực Tế',
    value: '@vvflorielle',
    link: 'https://www.tiktok.com/@vvflorielle',
    iconColor: '#000000',
    badge: 'Video',
    isEnabled: true,
    order: 3
  },
  {
    id: 'channel-fb',
    type: 'facebook',
    label: 'Fanpage V&V Florielle',
    value: 'facebook.com/vvflorielle',
    link: 'https://facebook.com/vvflorielle',
    iconColor: '#1877f2',
    isEnabled: true,
    order: 4
  },
  {
    id: 'channel-messenger',
    type: 'messenger',
    label: 'Chat Messenger',
    value: 'm.me/vvflorielle',
    link: 'https://m.me/vvflorielle',
    iconColor: '#a855f7',
    isEnabled: true,
    order: 5
  },
  {
    id: 'channel-maps',
    type: 'maps',
    label: 'Tiệm Hoa 105 Doãn Kế Thiện',
    value: '105 Doãn Kế Thiện, Cầu Giấy, Hà Nội',
    link: 'https://maps.google.com/?q=105+Doan+Ke+Thien+Cau+Giay+Ha+Noi',
    iconColor: '#059669',
    badge: 'Bản đồ',
    isEnabled: true,
    order: 6
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '849201',
    senderName: 'Trần Văn Minh',
    senderPhone: '0912345678',
    recipientName: 'Chị Nguyễn Thu Hà',
    recipientPhone: '0987654321',
    recipientAddress: 'Tòa nhà FPT Tower, Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
    deliveryDate: '2026-10-29',
    deliveryTimeSlot: '09:00 - 11:00',
    cardMessage: 'Chúc em sinh nhật vui vẻ, luôn rạng rỡ và thành công nhé!',
    items: [
      {
        productId: 'fl-03',
        productName: 'Bó Hoa Hồng Ecuador Đỏ Say Đắm (Chân Ái)',
        price: 850000,
        quantity: 1,
        ribbonColor: 'Đỏ nhung sang trọng',
        cardMessage: 'Chúc em sinh nhật vui vẻ!'
      }
    ],
    totalAmount: 870000,
    flowerPrice: 850000,
    shippingDistanceKm: 2,
    shippingFee: 20000,
    discountAmount: 0,
    paymentMethod: 'BANK_TRANSFER',
    paymentType: 'VIETQR_DEPOSIT_50',
    depositAmount: 435000,
    remainingAmount: 435000,
    paymentStatus: 'PARTIAL_PAID',
    paymentApprovedBy: 'ADMIN',
    paymentApprovedAt: '2026-10-29 08:45',
    status: 'ARRANGING',
    createdAt: '2026-10-29 08:30',
    note: 'Giao lễ tân gọi người nhận xuống nhận hoa.'
  },
  {
    id: '672153',
    senderName: 'Công ty Cổ phần TechGlobal',
    senderPhone: '0903112233',
    recipientName: 'Chi nhánh TechGlobal Cầu Giấy',
    recipientPhone: '0933445566',
    recipientAddress: 'Số 18 Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    deliveryDate: '2026-10-29',
    deliveryTimeSlot: '07:30 - 08:30',
    cardMessage: 'Công ty TechGlobal Chúc Mừng Khai Trương Hồng Phát - Vạn Sự Hanh Thông',
    items: [
      {
        productId: 'fl-01',
        productName: 'Kệ Hoa Khai Trương Phú Quý Thịnh Vượng (2 Tầng)',
        price: 1350000,
        quantity: 2,
        ribbonColor: 'Vàng kim lụa',
        cardMessage: 'Chúc mừng khai trương hồng phát!'
      }
    ],
    totalAmount: 2710000,
    flowerPrice: 2700000,
    shippingDistanceKm: 1.5,
    shippingFee: 20000,
    discountAmount: 10000,
    paymentMethod: 'BANK_TRANSFER',
    paymentType: 'VIETQR_FULL',
    depositAmount: 2710000,
    remainingAmount: 0,
    paymentStatus: 'PAID',
    paymentApprovedBy: 'AUTO_ASSISTANT',
    paymentApprovedAt: '2026-10-28 16:47',
    status: 'ARRANGING',
    createdAt: '2026-10-28 16:45',
    note: 'In banner ngang đỏ chữ vàng rõ nét.'
  },
  {
    id: '489312',
    senderName: 'Lê Hoàng Nam',
    senderPhone: '0945678901',
    recipientName: 'Bác Lê Thị Thanh',
    recipientPhone: '0918765432',
    recipientAddress: 'Số 36 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    deliveryDate: '2026-10-28',
    deliveryTimeSlot: '14:00 - 16:00',
    cardMessage: 'Kính chúc Mẹ sinh nhật tràn đầy sức khỏe và bình an!',
    items: [
      {
        productId: 'fl-04',
        productName: 'Giỏ Hoa Pastel Dịu Ngọt - Nắng Mới Cầu Giấy',
        price: 680000,
        quantity: 1,
        ribbonColor: 'Kem pastel',
        cardMessage: 'Chúc Mẹ sinh nhật an lành!'
      }
    ],
    totalAmount: 690000,
    flowerPrice: 680000,
    shippingDistanceKm: 1,
    shippingFee: 10000,
    discountAmount: 0,
    paymentMethod: 'COD',
    paymentType: 'COD',
    depositAmount: 345000,
    remainingAmount: 345000,
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    createdAt: '2026-10-28 10:15',
    pointsAwarded: 68,
    pointsAwardedAt: '2026-10-28 15:30'
  }
];

export const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: 'cust-01',
    phone: '0912345678',
    fullName: 'Trần Văn Minh',
    email: 'tranvanminh@gmail.com',
    password: 'password123',
    address: 'Tòa nhà FPT Tower, Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
    points: 150,
    tier: 'Vàng',
    isVerified: true,
    totalSpent: 4250000,
    ordersCount: 4,
    registeredAt: '2026-08-15',
    birthday: '1992-11-20',
    notes: 'Thích cắm hoa tone pastel, thường đặt tặng sinh nhật đối tác.',
    status: 'ACTIVE',
    favoriteFlowers: ['Hoa hồng Ecuador', 'Cát tường', 'Lá bạc'],
    savedAddresses: [
      {
        id: 'addr-1',
        name: 'Văn phòng Cầu Giấy',
        recipientName: 'Trần Văn Minh',
        recipientPhone: '0912345678',
        recipientAddress: 'Tòa nhà FPT Tower, Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
        distanceKm: 2,
        isDefault: true
      },
      {
        id: 'addr-2',
        name: 'Nhà riêng Ba Đình',
        recipientName: 'Chị Nguyễn Thu Hà',
        recipientPhone: '0987654321',
        recipientAddress: 'Số 45 Liễu Giai, Ba Đình, Hà Nội',
        distanceKm: 5,
        isDefault: false
      }
    ]
  },
  {
    id: 'cust-02',
    phone: '0903112233',
    fullName: 'Công ty Cổ phần TechGlobal',
    email: 'admin@techglobal.vn',
    password: 'password123',
    address: 'Số 18 Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    points: 420,
    tier: 'Kim Cương',
    isVerified: true,
    totalSpent: 12800000,
    ordersCount: 9,
    registeredAt: '2026-05-10',
    notes: 'Khách hàng doanh nghiệp VIP, chuyên đặt kệ khai trương 2-3 tầng.',
    status: 'ACTIVE',
    favoriteFlowers: ['Hoa hướng dương', 'Lan hồ điệp', 'Thiên điểu']
  },
  {
    id: 'cust-03',
    phone: '0945678901',
    fullName: 'Lê Hoàng Nam',
    email: 'nam.lehoang@gmail.com',
    password: 'password123',
    address: 'Số 36 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    points: 85,
    tier: 'Bạc',
    isVerified: true,
    totalSpent: 2150000,
    ordersCount: 3,
    registeredAt: '2026-09-02',
    birthday: '1995-04-12',
    notes: 'Đặt hoa tặng gia đình, yêu cầu chụp hình trước khi giao.',
    status: 'ACTIVE',
    favoriteFlowers: ['Giỏ hoa mây vintage', 'Lan hồ điệp trắng']
  },
  {
    id: 'cust-04',
    phone: '0988776655',
    fullName: 'Nguyễn Thúy Hằng',
    email: 'thuyhang.nguyen@outlook.com',
    password: 'password123',
    address: 'Số 105 Xuân Thủy, Cầu Giấy, Hà Nội',
    points: 30,
    tier: 'Thành viên mới',
    isVerified: false, // Thành viên thường, chưa OTP (điểm 70%)
    totalSpent: 300000,
    ordersCount: 1,
    registeredAt: '2026-10-25',
    notes: 'Khách hàng mới cần xác thực OTP để nhận 100% giá trị điểm.',
    status: 'ACTIVE',
    favoriteFlowers: ['Hoa baby trắng', 'Hoa hồng đỏ']
  }
];

export const INITIAL_CUSTOMER: CustomerUser = INITIAL_CUSTOMERS[0];

export const INITIAL_PROMOTIONS: PromotionItem[] = [
  {
    id: 'promo-01',
    code: 'FREESHIP30K',
    title: 'Ưu Đãi Chào Bạn Mới (Freeship 30K)',
    description: 'Miễn phí vận chuyển tối đa 30.000đ cho đơn hàng hoa tươi từ 300.000đ dành cho hội viên kích hoạt.',
    discountAmount: 30000,
    minOrder: 300000,
    badge: 'Chào Bạn Mới',
    validUntil: '31/12/2026',
    discountType: 'FREESHIP',
    maxDiscount: 30000,
    isActive: true,
    isWelcomeVoucher: true
  },
  {
    id: 'promo-02',
    code: 'SHIP10K',
    title: 'Voucher Vận Chuyển 10K',
    description: 'Đổi bằng 100 điểm thưởng tích lũy. Giảm 10.000đ phí giao hàng cho đơn bất kỳ.',
    discountAmount: 10000,
    minOrder: 150000,
    badge: 'Đổi 100 Điểm',
    validUntil: '31/12/2026',
    discountType: 'FREESHIP',
    isActive: true,
    pointsToRedeem: 100
  },
  {
    id: 'promo-03',
    code: 'SHIP20K',
    title: 'Voucher Vận Chuyển 20K',
    description: 'Đổi bằng 200 điểm thưởng tích lũy. Giảm 20.000đ phí giao hàng cho đơn bất kỳ.',
    discountAmount: 20000,
    minOrder: 250000,
    badge: 'Đổi 200 Điểm',
    validUntil: '31/12/2026',
    discountType: 'FREESHIP',
    isActive: true,
    pointsToRedeem: 200
  },
  {
    id: 'promo-04',
    code: 'SHIP30K',
    title: 'Voucher Vận Chuyển 30K',
    description: 'Đổi bằng 300 điểm thưởng tích lũy. Giảm 30.000đ phí giao hàng cho đơn bất kỳ.',
    discountAmount: 30000,
    minOrder: 350000,
    badge: 'Đổi 300 Điểm',
    validUntil: '31/12/2026',
    discountType: 'FREESHIP',
    isActive: true,
    pointsToRedeem: 300
  },
  {
    id: 'promo-05',
    code: 'FLORIELLE10',
    title: 'Tri Ân Đơn Lớn Giảm 10%',
    description: 'Giảm 10% cho đơn hoa khai trương, lan hồ điệp từ 800.000đ (giảm tối đa 100.000đ).',
    discountAmount: 80000,
    minOrder: 800000,
    badge: 'VIP 10%',
    validUntil: '31/12/2026',
    discountType: 'PERCENT',
    maxDiscount: 100000,
    isActive: true
  }
];

export const INITIAL_ARTICLES: BlogArticle[] = [
  {
    id: 'art-01',
    title: 'Bí Quyết Giữ Hoa Tươi Lâu 5 - 7 Ngày Không Bị Héo Rũ',
    summary: 'Hướng dẫn chi tiết từ florist V&V Florielle 105 Doãn Kế Thiện: cách cắt vát gốc cành 45 độ, liều lượng nước dưỡng và chọn vị trí đặt hoa lý tưởng.',
    category: 'Mẹo Cắm Hoa',
    readTime: '3 phút đọc',
    publishedAt: '28/10/2026',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    content: [
      'Để hoa tươi lâu, điều đầu tiên là dùng kéo sắc cắt vát 45 độ phần gốc cành hoa dưới vòi nước chảy để tránh bọt khí tràn vào mao mạch.',
      'Rửa sạch bình hoa trước khi cắm, thay nước mỗi ngày một lần và pha thêm 1/2 gói dưỡng hoa tặng kèm của V&V Florielle.',
      'Đặt bình hoa ở nơi thoáng khí, tránh gió quạt thổi trực tiếp và tránh ánh nắng gắt hay đặt gần trái cây chín sinh khí ethylene.'
    ]
  },
  {
    id: 'art-02',
    title: 'Cách Chọn Kệ Hoa Khai Trương Tài Lộc Hợp Phong Thủy Tại Hà Nội',
    summary: 'Ý nghĩa các tone màu hoa phong thủy: Tone Đỏ - Vàng chiêu tài tấn bảo, Tone Cam nhiệt huyết bứt phá và Lan hồ điệp vương giả.',
    category: 'Phong Thủy & Ý Nghĩa',
    readTime: '4 phút đọc',
    publishedAt: '25/10/2026',
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    content: [
      'Ngày khai trương đánh dấu sự khởi đầu của một hành trình kinh doanh. Kệ hoa 2 hoặc 3 tầng với tone Đỏ (may mắn) và Vàng (phát tài) luôn là lựa chọn hàng đầu.',
      'Hoa hướng dương tượng trưng cho sự vươn lên mạnh mẽ đón ánh bình minh, trong khi hoa lan vũ nữ mang lại năng lượng tiền tài suôn sẻ.',
      'V&V Florielle 105 Doãn Kế Thiện luôn hỗ trợ in banner chúc mừng thiết kế đồng điệu với tone màu chủ đạo của kệ hoa.'
    ]
  },
  {
    id: 'art-03',
    title: 'Ý Nghĩa Số Lượng Bông Hồng Ecuador: Trao Gửi Đúng Thông Điệp',
    summary: 'Tìm hiểu thông điệp bí mật đằng sau từng bó hoa hồng Ecuador đỏ: 1 bông, 9 bông, 19 bông hay 99 bông.',
    category: 'Cẩm Nang Tình Yêu',
    readTime: '3 phút đọc',
    publishedAt: '20/10/2026',
    imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
    content: [
      'Bó 9 bông hồng Ecuador: Tượng trưng cho tình yêu vĩnh cửu, trường tồn theo năm tháng.',
      'Bó 19 bông: Lời nhắn nhủ kiên định "Hãy kiên nhẫn và chờ đợi tình yêu chân thành".',
      'Bó 99 bông hồng đỏ: Lời khẳng định đanh thép "Mãi mãi bên nhau trọn kiếp trọn đời".'
    ]
  }
];

export const INITIAL_HERO_CONFIG: HeroBannerConfig = {
  badge: 'Tiệm Hoa Tươi Nghệ Thuật V&V Florielle',
  title: 'Chào Mừng Đến Với Tiệm Hoa V&V Florielle - Nghệ Thuật Trao Gửi Yêu Thương',
  subtitle: '105 Doãn Kế Thiện, Cầu Giấy, Hà Nội • 100% hoa tươi loại một nhập mới mỗi sáng từ Đà Lạt & hoa ngoại nhập khẩu cao cấp. Giao hỏa tốc 60 - 90 phút nội thành Hà Nội – Chụp ảnh gửi mẫu duyệt qua Zalo trước khi giao.',
  ctaText: 'Khám Phá Mẫu Hoa Mới',
  ctaSecondaryText: 'Tư Vấn Thiết Kế Riêng',
  backgroundImage: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1600&q=80',
  features: ['Giao hỏa tốc 60-90P Cầu Giấy & Hà Nội', 'Tặng thiệp viết tay & Ruy băng lụa', 'Chụp ảnh gửi duyệt trước khi giao']
};

export const INITIAL_MARQUEE_ANNOUNCEMENTS: MarqueeItem[] = [
  {
    id: 'marq-01',
    text: '105 Doãn Kế Thiện, Cầu Giấy, Hà Nội • Giao hoa tươi hỏa tốc 60-90 phút • Tuyển chọn hoa mới mỗi sáng',
    tag: 'CỬA HÀNG',
    isEnabled: true,
    order: 1
  },
  {
    id: 'marq-02',
    text: 'Tặng Voucher 30.000đ cho khách hàng mới • Nhập mã FREESHIP30K khi thanh toán đơn online',
    tag: 'ƯU ĐÃI',
    isEnabled: true,
    order: 2
  },
  {
    id: 'marq-03',
    text: 'Hệ thống trợ lý duyệt bill cọc tự động qua VietQR 24/7 chỉ trong 2 phút siêu tiện lợi',
    tag: 'THANH TOÁN',
    isEnabled: true,
    order: 3
  },
  {
    id: 'marq-04',
    text: 'Đặc quyền Hội viên: Tích lũy điểm nhận hoa quà sinh nhật 100% Freeship & ưu đãi độc quyền',
    tag: 'HỘI VIÊN',
    isEnabled: true,
    order: 4
  }
];
