import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { inMemoryDB, pool, isPostgresConnected } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =========================================================================
// 1. SMART KEEP-ALIVE HEALTHCHECK (Cho Cloudflare Worker & Render + Neon)
// =========================================================================
app.get('/api/health', async (req, res) => {
  const now = new Date();
  const vnHour = (now.getUTCHours() + 7) % 24;
  let dbStatus = 'In-Memory (Fallback)';

  if (pool && isPostgresConnected) {
    try {
      // Chạm vào Neon PostgreSQL để giữ DB luôn hoạt động
      await pool.query('SELECT 1');
      dbStatus = 'Neon PostgreSQL Active';
    } catch (err) {
      dbStatus = 'Neon DB Error: ' + err.message;
    }
  }

  res.json({
    status: 'online',
    server: 'Render Web Service',
    database: dbStatus,
    vietnamTime: `${vnHour}:${now.getUTCMinutes().toString().padStart(2, '0')} (UTC+7)`,
    uptime: process.uptime(),
    timestamp: now.toISOString()
  });
});

// =========================================================================
// 2. PRODUCTS API (Dành cho Web Khách & Admin)
// =========================================================================
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let results = [...inMemoryDB.products];

  if (category && category !== 'Tất cả') {
    results = results.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

app.get('/api/products/:id', (req, res) => {
  const product = inMemoryDB.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  }
  res.json(product);
});

// Admin: Thêm sản phẩm hoa mới
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  if (!newProduct || !newProduct.name) {
    return res.status(400).json({ error: 'Thiếu thông tin sản phẩm' });
  }
  if (!newProduct.id) {
    newProduct.id = 'VV-' + Math.floor(300 + Math.random() * 600);
  }
  inMemoryDB.products.unshift(newProduct);
  console.log(`[Admin] Đã thêm sản phẩm mới: ${newProduct.name} (${newProduct.sku || newProduct.id})`);
  res.status(201).json({ success: true, product: newProduct });
});

// Admin: Cập nhật giá sản phẩm
app.put('/api/products/:id/price', (req, res) => {
  const { newPrice } = req.body;
  const product = inMemoryDB.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  }

  product.basePrice = Number(newPrice);
  console.log(`[Admin] Đã cập nhật giá sản phẩm ${product.id} thành ${product.basePrice}đ`);
  res.json({ success: true, product });
});

// Admin: Tăng giá nhanh mùa Lễ (+X%)
app.post('/api/products/surge-holiday', (req, res) => {
  const { percentage = 20 } = req.body;
  const rate = 1 + (percentage / 100);

  inMemoryDB.products.forEach(p => {
    p.basePrice = Math.round((p.basePrice * rate) / 10000) * 10000;
  });

  console.log(`[Admin] Đã tăng giá hàng loạt ${percentage}% cho các sản phẩm hoa.`);
  res.json({ success: true, percentage, products: inMemoryDB.products });
});

// =========================================================================
// 3. CUSTOMIZATION OPTIONS (Màu giấy, ruy băng, phụ kiện)
// =========================================================================
app.get('/api/customizations', (req, res) => {
  res.json({
    wrappingPapers: inMemoryDB.wrappingPapers,
    ribbons: inMemoryDB.ribbons,
    addons: inMemoryDB.addons
  });
});

// =========================================================================
// 4. ORDERS API (Guest Checkout & Florist Work Orders)
// =========================================================================

// Lấy danh sách đơn hàng (cho Admin Portal)
app.get('/api/orders', (req, res) => {
  res.json(inMemoryDB.orders);
});

// Tra cứu chi tiết 1 đơn hàng (cho Khách xem tiến độ & duyệt ảnh)
app.get('/api/orders/:id', (req, res) => {
  const order = inMemoryDB.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Không tìm thấy mã đơn hàng này' });
  }
  res.json(order);
});

// Tạo đơn hàng mới từ Web Khách (Không cần đăng nhập)
app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const newOrderId = 'DH-VV' + Math.floor(1000 + Math.random() * 9000);

  const newOrder = {
    id: newOrderId,
    createdAt: new Date().toISOString(),
    status: 'pending', // pending -> preparing -> photo_sent -> approved -> shipping -> completed
    ...orderData,
    finishedPhotos: []
  };

  inMemoryDB.orders.unshift(newOrder);
  console.log(`🌸 [ĐƠN HÀNG MỚI] Đã nhận đơn #${newOrderId} từ ${newOrder.customer?.name || 'Khách Vãng Lai'}`);

  res.status(201).json({
    success: true,
    message: 'Đặt hoa thành công!',
    orderId: newOrderId,
    order: newOrder
  });
});

// Admin: Cập nhật trạng thái đơn hàng (Đang cắm -> Đã cắm -> Đang ship...)
app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = inMemoryDB.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
  }

  order.status = status;
  console.log(`[Admin] Đơn #${order.id} chuyển trạng thái sang: ${status}`);
  res.json({ success: true, order });
});

// Admin: Chụp/Tải ảnh hoa thật gửi khách duyệt
app.post('/api/orders/:id/photos', (req, res) => {
  const { photoUrl } = req.body;
  const order = inMemoryDB.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
  }

  if (photoUrl) {
    order.finishedPhotos.push(photoUrl);
    order.status = 'photo_sent';
  }

  console.log(`📸 [Admin] Đã gửi ảnh hoa thật cho đơn #${order.id}`);
  res.json({ success: true, order });
});

// Khách hàng: Duyệt ảnh thành phẩm ("Đồng ý giao ngay")
app.post('/api/orders/:id/approve', (req, res) => {
  const order = inMemoryDB.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
  }

  order.status = 'approved';
  console.log(`✅ [Khách] Khách đã DUYỆT ẢNH đơn #${order.id}! Sẵn sàng giao.`);
  res.json({ success: true, order });
});

// =========================================================================
// 5. AUTHENTICATION & CUSTOMER PORTAL API
// =========================================================================

// Customer login / register
app.post('/api/auth/customer-login', (req, res) => {
  const { phoneOrEmail, name } = req.body;
  if (!phoneOrEmail) {
    return res.status(400).json({ error: 'Vui lòng cung cấp số điện thoại hoặc email' });
  }

  const customerUser = {
    id: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
    name: name || 'Khách Thân Thiết',
    phone: phoneOrEmail.includes('@') ? '0903.111.890' : phoneOrEmail,
    email: phoneOrEmail.includes('@') ? phoneOrEmail : 'khachhang@vvflorielle.com',
    tier: 'Thành Viên Hoa Hồng (Rose Member)',
    rewardPoints: 120,
    vouchers: [
      { code: 'CHAOXUAN50', discount: 50000, desc: 'Giảm 50k cho đơn từ 450k', expiry: '30/11/2026' },
      { code: 'FREESHIP2H', discount: 35000, desc: 'Miễn phí giao hỏa tốc 2 giờ', expiry: '31/12/2026' }
    ],
    savedAddresses: [
      '105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội',
      'Tòa nhà Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội'
    ]
  };

  res.json({ success: true, user: customerUser });
});

// Admin secret login with PIN
app.post('/api/auth/admin-login', (req, res) => {
  const { username, password, pin } = req.body;
  if (
    (username === 'admin' || username === 'vvflorielle' || username?.includes('vvflorielle')) &&
    (password === 'admin123' || password === 'rnd_kZAntNAOVM3xaMEYPnir6b0zrlo4') &&
    (pin === '888999' || pin === '123456')
  ) {
    const adminToken = 'vv_adm_' + Date.now();
    res.json({
      success: true,
      role: 'ADMIN',
      token: adminToken,
      displayName: 'Chủ Quán V&V Florielle'
    });
  } else {
    res.status(401).json({ error: 'Thông tin tài khoản hoặc mã PIN quản trị không chính xác' });
  }
});

// Admin PIN Recovery via Gmail App Password & OTP
app.post('/api/auth/send-pin-otp', async (req, res) => {
  const { email, appPassword, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Thiếu email hoặc mã OTP' });
  }

  console.log(`[Security] Yêu cầu gửi mã OTP ${otp} đến email: ${email}`);

  if (appPassword) {
    try {
      const nodemailer = await import('nodemailer').catch(() => null);
      if (nodemailer) {
        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          auth: {
            user: email,
            pass: appPassword.replace(/\s+/g, '')
          }
        });

        await transporter.sendMail({
          from: `"V&V Florielle Security" <${email}>`,
          to: email,
          subject: `[V&V Florielle] Mã OTP khôi phục PIN Quản Trị: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 500px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #059669; margin-top: 0;">V&V Florielle - Bảo Mật Hệ Thống</h2>
              <p>Xin chào Chủ Quán V&V Florielle,</p>
              <p>Hệ thống nhận được yêu cầu đổi / khôi phục mã PIN Quản trị. Dưới đây là mã xác thực OTP của bạn:</p>
              <div style="background: #ecfdf5; border: 1px dashed #059669; padding: 14px; font-size: 26px; font-weight: bold; letter-spacing: 5px; text-align: center; color: #047857; margin: 18px 0; border-radius: 8px;">
                ${otp}
              </div>
              <p style="font-size: 12px; color: #64748b;">Mã này có hiệu lực trong 10 phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
            </div>
          `
        });
        return res.json({ success: true, message: `Mã OTP đã được gửi thành công đến ${email}` });
      }
    } catch (err) {
      console.error('[Security] Lỗi gửi Gmail qua Nodemailer:', err.message);
      return res.json({ success: false, message: 'Lỗi SMTP Google: ' + err.message, fallbackOtp: otp });
    }
  }

  res.json({ success: true, message: 'Đã tạo OTP xác thực', otp });
});

// Customer order history by phone
app.get('/api/customer/orders', (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.json([]);
  }
  const customerOrders = inMemoryDB.orders.filter(o => o.customer?.phone === phone);
  res.json(customerOrders);
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🌸 [V&V Florielle Boutique API] Server running at http://localhost:${PORT}`);
  console.log(`👉 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`👉 Products API: http://localhost:${PORT}/api/products`);
  console.log(`👉 Orders API: http://localhost:${PORT}/api/orders\n`);
});
