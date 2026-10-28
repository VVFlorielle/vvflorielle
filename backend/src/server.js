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

// Start Server
app.listen(PORT, () => {
  console.log(`\n🌸 [V&V Florielle Boutique API] Server running at http://localhost:${PORT}`);
  console.log(`👉 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`👉 Products API: http://localhost:${PORT}/api/products`);
  console.log(`👉 Orders API: http://localhost:${PORT}/api/orders\n`);
});
