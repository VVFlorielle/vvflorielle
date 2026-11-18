import { Order, FlowerProduct } from '../types';

export const NEON_API_BASE = 'https://vvflorielle-api.onrender.com/api';

/**
 * Smart Auto-Wakeup Engine for Render
 * Gửi tín hiệu ngầm đánh thức máy chủ Render ngay khi người dùng vừa mở trang web
 * hoặc khi phát sinh tương tác (thêm vào giỏ hàng, mở thanh toán).
 * Giúp máy chủ thức sẵn 100% trước khi khách bấm đặt đơn mà không làm chậm giao diện.
 */
let lastWakeupPing = 0;
export function triggerSmartWakeup(action = 'page_visit'): void {
  const now = Date.now();
  // Giới hạn tần suất ping tối thiểu cách nhau 30 giây để tối ưu tài nguyên mạng
  if (now - lastWakeupPing < 30000) return;
  lastWakeupPing = now;

  try {
    fetch(`${NEON_API_BASE}/health`, { method: 'GET', keepalive: true })
      .then((res) => {
        if (res.ok) {
          console.log(`[Smart Wakeup (${action})] Máy chủ Render đã thức và sẵn sàng 100%!`);
        }
      })
      .catch(() => {
        // Tín hiệu ngầm không gây ảnh hưởng tới UI
      });
  } catch {
    // Tránh ngoại lệ môi trường mạng
  }
}

/**
 * Health check for Neon PostgreSQL backend on Render
 */
export async function checkNeonHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${NEON_API_BASE}/health`, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'online' && Boolean(data.database?.includes('Neon'));
  } catch (err) {
    console.warn('[Neon API] Health check failed, falling back to local storage:', err);
    return false;
  }
}

/**
 * Push a newly placed order to Neon PostgreSQL via Render API
 */
export async function pushOrderToNeon(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      ...order,
      // Ensure compatibility with backend schema
      customer: {
        name: order.senderName,
        phone: order.senderPhone
      },
      delivery: {
        receiverName: order.recipientName,
        receiverPhone: order.recipientPhone,
        address: order.recipientAddress,
        timeSlot: order.deliveryTimeSlot || `${order.deliveryDate} ${order.deliveryTimeSlot}`
      },
      totalPrice: order.totalAmount
    };

    const res = await fetch(`${NEON_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      console.log('[Neon API] Order pushed successfully to Neon PostgreSQL:', data.orderId || order.id);
      return { success: true };
    } else {
      const errorText = await res.text();
      console.warn('[Neon API] Push order returned non-OK status:', res.status, errorText);
      return { success: false, error: errorText };
    }
  } catch (err: any) {
    console.warn('[Neon API] Failed to push order to Neon PostgreSQL (will persist locally):', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all orders from Neon PostgreSQL via Render API
 */
export async function fetchNeonOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${NEON_API_BASE}/orders`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.warn('[Neon API] fetchNeonOrders returned status:', res.status);
      return [];
    }

    const rawList = await res.json();
    if (!Array.isArray(rawList)) return [];

    // Normalize raw items to full Order interface
    return rawList.map((item: any): Order => {
      // Extract from item or nested delivery/customer
      const senderName = item.senderName || item.customer?.name || 'Khách đặt hoa';
      const senderPhone = item.senderPhone || item.customer?.phone || '0900000000';
      const recipientName = item.recipientName || item.delivery?.receiverName || senderName;
      const recipientPhone = item.recipientPhone || item.delivery?.receiverPhone || senderPhone;
      const recipientAddress = item.recipientAddress || item.delivery?.address || '105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội';
      const deliveryTimeSlot = item.deliveryTimeSlot || item.delivery?.timeSlot || 'Trong ngày';
      const totalAmount = Number(item.totalAmount || item.totalPrice || 0);

      return {
        id: item.id || `DH-VV${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: item.customerId,
        senderName,
        senderPhone,
        recipientName,
        recipientPhone,
        recipientAddress,
        deliveryDate: item.deliveryDate || new Date(item.createdAt || Date.now()).toLocaleDateString('vi-VN'),
        deliveryTimeSlot,
        cardMessage: item.cardMessage || item.card?.message || '',
        items: Array.isArray(item.items) && item.items.length > 0 ? item.items : [
          {
            productId: item.productId || 'VV-108',
            productName: item.productName || 'Bó Hoa Tươi V&V Florielle',
            price: totalAmount,
            quantity: 1,
            ribbonColor: item.recipe?.ribbon || 'Satin Champagne',
            cardMessage: item.card?.message || ''
          }
        ],
        totalAmount,
        flowerPrice: Number(item.flowerPrice || totalAmount),
        shippingDistanceKm: Number(item.shippingDistanceKm || 0),
        shippingFee: Number(item.shippingFee || 0),
        discountAmount: Number(item.discountAmount || 0),
        paymentMethod: item.paymentMethod || 'BANK_TRANSFER',
        paymentType: item.paymentType || 'VIETQR_FULL',
        depositAmount: Number(item.depositAmount || totalAmount),
        remainingAmount: Number(item.remainingAmount || 0),
        status: (item.status?.toUpperCase() || 'PENDING') as any,
        depositStatus: item.depositStatus || (item.payment?.status === 'paid' ? 'APPROVED' : 'PENDING'),
        isDepositPaid: Boolean(item.isDepositPaid || item.payment?.status === 'paid'),
        paymentStatus: item.paymentStatus || (item.payment?.status === 'paid' ? 'PAID' : 'UNPAID'),
        createdAt: item.createdAt || new Date().toLocaleString('vi-VN')
      };
    });
  } catch (err: any) {
    console.warn('[Neon API] fetchNeonOrders failed:', err.message);
    return [];
  }
}

/**
 * Fetch all products from Neon PostgreSQL via Render API
 */
export async function fetchNeonProducts(): Promise<FlowerProduct[]> {
  try {
    const res = await fetch(`${NEON_API_BASE}/products`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) return [];
    const list = await res.json();
    if (!Array.isArray(list)) return [];

    return list.map((item: any): FlowerProduct => ({
      id: item.id,
      name: item.name,
      categoryId: item.categoryId || item.category || 'sinh-nhat',
      price: Number(item.price || item.basePrice || 0),
      originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
      tag: item.tag || item.badge,
      imageUrl: item.imageUrl || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
      flowerTypes: Array.isArray(item.flowerTypes) ? item.flowerTypes : [item.components?.mainFlowers || 'Hoa tươi chọn lọc'].filter(Boolean),
      description: item.description || '',
      meaning: item.meaning || item.description || '',
      gradientTheme: item.gradientTheme || {
        bg: 'from-amber-50 to-orange-50/40',
        accent: 'text-amber-700',
        tagBg: 'bg-amber-100 text-amber-800'
      },
      isAvailable: item.isAvailable !== false,
      rating: Number(item.rating || 5.0),
      reviewCount: Number(item.reviewCount || item.reviewsCount || 10)
    }));
  } catch (err: any) {
    console.warn('[Neon API] fetchNeonProducts failed:', err.message);
    return [];
  }
}

/**
 * Push an edited or new flower product to Neon PostgreSQL via Render API
 */
export async function pushProductToNeon(product: FlowerProduct): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: product.id,
      name: product.name,
      category: product.categoryId,
      basePrice: product.price,
      originalPrice: product.originalPrice,
      badge: product.tag,
      description: product.description,
      imageUrl: product.imageUrl,
      images: [product.imageUrl],
      isAvailable: product.isAvailable,
      rating: product.rating,
      reviewsCount: product.reviewCount,
      components: {
        mainFlowers: product.flowerTypes.join(', ')
      }
    };

    const res = await fetch(`${NEON_API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('[Neon API] Product synced successfully to Neon PostgreSQL:', product.id);
      return { success: true };
    }
    return { success: false, error: await res.text() };
  } catch (err: any) {
    console.warn('[Neon API] Failed to sync product to Neon PostgreSQL:', err.message);
    return { success: false, error: err.message };
  }
}
