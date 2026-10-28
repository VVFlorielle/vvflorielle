// API Client for Hoa Tuoi Linh Phuong
// Connects to Backend on Render / Localhost, with graceful mock fallback

const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' ? '/api' : 'https://vvflorielle-api.onrender.com/api');

export const api = {
  // Health check (used by keep-alive pinger)
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline', server: 'Local Mock' };
    }
  },

  // Products
  async getProducts(category = '', search = '') {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'Tất cả') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('API error, falling back to local data:', err);
      return null;
    }
  },

  async updatePrice(productId, newPrice) {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/price`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPrice })
      });
      return await res.json();
    } catch (err) {
      console.error('Error updating price:', err);
      return { success: false };
    }
  },

  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating product:', err);
      return { success: false };
    }
  },

  async surgeHolidayPrice(percentage = 20) {
    try {
      const res = await fetch(`${API_BASE}/products/surge-holiday`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage })
      });
      return await res.json();
    } catch (err) {
      console.error('Error surging holiday prices:', err);
      return { success: false };
    }
  },

  // Customizations
  async getCustomizations() {
    try {
      const res = await fetch(`${API_BASE}/customizations`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // Orders
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getOrderById(orderId) {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating order:', err);
      return { success: false };
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      console.error('Error updating order status:', err);
      return { success: false };
    }
  },

  async uploadFinishedPhoto(orderId, photoUrl) {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl })
      });
      return await res.json();
    } catch (err) {
      console.error('Error uploading photo:', err);
      return { success: false };
    }
  },

  async approveOrderPhoto(orderId) {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/approve`, {
        method: 'POST'
      });
      return await res.json();
    } catch (err) {
      console.error('Error approving photo:', err);
      return { success: false };
    }
  }
};
