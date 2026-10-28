/**
 * Cloudflare Worker Cron - Smart Keep-Alive Pinger
 * Cho hệ thống Hoa Tươi Linh Phương (Render + Neon)
 *
 * Chạy định kỳ mỗi 4 phút:
 * - Khung giờ 05:00 - 23:59 (Giờ Việt Nam UTC+7): Tự động ping /api/health để giữ Render & Neon luôn thức tỉnh.
 * - Khung giờ 00:00 - 04:59 (Đêm khuya): Không ping, để Render & Neon tự ngủ tiết kiệm hạn mức 750h free/tháng.
 */

export default {
  // Khi cron trigger kích hoạt
  async scheduled(event, env, ctx) {
    const now = new Date();
    // Đổi sang giờ Việt Nam (UTC + 7)
    const vnHour = (now.getUTCHours() + 7) % 24;
    const vnMinute = now.getUTCMinutes();
    const timeStr = `${vnHour.toString().padStart(2, '0')}:${vnMinute.toString().padStart(2, '0')}`;

    // Địa chỉ Backend API của bạn trên Render (Thay đổi URL của bạn sau khi deploy)
    const BACKEND_HEALTH_URL = env.BACKEND_HEALTH_URL || "https://hoatuoilinhphuong-api.onrender.com/api/health";

    if (vnHour >= 5 && vnHour < 24) {
      try {
        const response = await fetch(BACKEND_HEALTH_URL, {
          headers: { 'User-Agent': 'Cloudflare-Worker-KeepAlive/1.0' }
        });
        const data = await response.json().catch(() => ({}));
        console.log(`[${timeStr} VN] 🟢 Ping thành công: Render Status ${response.status}, DB: ${data.database || 'OK'}`);
      } catch (err) {
        console.error(`[${timeStr} VN] 🔴 Lỗi khi ping Backend:`, err.message);
      }
    } else {
      console.log(`[${timeStr} VN] 🌙 Đêm khuya (0h - 5h sáng): Để Render & Neon ngủ đông tiết kiệm hạn mức free.`);
    }
  },

  // Hỗ trợ gọi thủ công qua HTTP để test
  async fetch(request, env, ctx) {
    const now = new Date();
    const vnHour = (now.getUTCHours() + 7) % 24;
    return new Response(JSON.stringify({
      status: "Keep-Alive Worker Active",
      vietnamHour: vnHour,
      shouldPingNow: vnHour >= 5 && vnHour < 24,
      schedule: "Active: 05:00 - 24:00 (UTC+7) | Sleeping: 00:00 - 05:00 (UTC+7)"
    }, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
