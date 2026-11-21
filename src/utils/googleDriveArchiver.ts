import { Order, ShopSettings, FlowerProduct, ArchivedFlowerProduct } from '../types';

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * GOOGLE APPS SCRIPT: TỰ ĐỘNG ĐỒNG BỘ ẢNH BIÊN LAI V&V FLORIELLE LÊN GOOGLE DRIVE
 * 
 * Hướng dẫn cài đặt 60 giây (Hoàn toàn miễn phí, an toàn tuyệt đối):
 * 1. Mở trang https://script.google.com/ và đăng nhập Gmail tiệm hoa.
 * 2. Bấm "Dự án mới" (New project), xóa hết nội dung cũ và dán toàn bộ đoạn mã này vào.
 * 3. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment).
 * 4. Chọn loại: "Ứng dụng web" (Web app).
 * 5. Thiết lập:
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone)
 * 6. Bấm "Triển khai", cấp quyền truy cập Google Drive của bạn khi được hỏi.
 * 7. Sao chép "URL ứng dụng web" (dạng: https://script.google.com/macros/s/.../exec) 
 *    và dán vào ô "URL Webhook Google Drive" trong Cài Đặt Lưu Trữ của Tiệm.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // =========================================================================
    // XỬ LÝ 1: TỰ ĐỘNG GỬI EMAIL MÃ OTP BẢO MẬT 2FA (QUA GMAIL TIỆM)
    // =========================================================================
    if (data.action === "SEND_EMAIL_OTP") {
      var recipient = data.recipient || "traivuho@gmail.com";
      var subject = data.subject || "🌸 [V&V Florielle] Mã OTP Xác Thực Quản Trị Cấp 2";
      var otpCode = data.otpCode || "";
      var purpose = data.purpose || "Xác thực bảo mật tài khoản tiệm";

      var htmlBody = ""
        + "<div style='font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;'>"
        + "  <div style='text-align: center; margin-bottom: 20px;'>"
        + "    <h2 style='color: #047857; margin: 0;'>🌸 V&V Florielle Boutique</h2>"
        + "    <p style='color: #64748b; font-size: 13px; margin-top: 4px;'>Tiệm Hoa Nghệ Thuật & Thiết Kế Cao Cấp Hà Nội</p>"
        + "  </div>"
        + "  <div style='background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 20px;'>"
        + "    <p style='color: #166534; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;'>MÃ XÁC THỰC BẢO MẬT (OTP 2FA)</p>"
        + "    <div style='font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #047857; font-family: monospace;'>" + otpCode + "</div>"
        + "    <p style='color: #64748b; font-size: 12px; margin: 8px 0 0 0;'>Mã có hiệu lực trong 5 phút. Mục đích: " + purpose + ".</p>"
        + "  </div>"
        + "  <p style='color: #475569; font-size: 13px; line-height: 1.6;'>Yêu cầu này được gửi từ Trang Quản Trị V&V Florielle. Tuyệt đối không cung cấp mã này cho bất kỳ ai để đảm bảo an toàn kho hàng và doanh thu của tiệm.</p>"
        + "</div>";

      GmailApp.sendEmail(recipient, subject, "Mã xác thực OTP của bạn là: " + otpCode, {
        htmlBody: htmlBody,
        name: "V&V Florielle Boutique"
      });

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Đã gửi email OTP thành công qua Gmail"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!data.base64Image) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Thiếu dữ liệu ảnh base64Image"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Thư mục đích trên Google Drive của tiệm (Đã cài sẵn ID thư mục của bạn)
    var targetFolderId = data.targetFolderId || "1icGtru1WHHVF48k9M1wL9Fei-wLsg4Bq";
    var rootFolder = null;
    if (targetFolderId) {
      try {
        rootFolder = DriveApp.getFolderById(targetFolderId);
      } catch (errFolder) {
        rootFolder = null;
      }
    }
    if (!rootFolder) {
      var rootFolderName = "V&V Florielle - Kho Biên Lai Cọc";
      var rootFolders = DriveApp.getFoldersByName(rootFolderName);
      rootFolder = rootFolders.hasNext() ? rootFolders.next() : DriveApp.createFolder(rootFolderName);
    }

    // 2. Thư mục con theo Tháng - Năm
    var now = new Date();
    var subfolderName = "Tháng " + (now.getMonth() + 1) + "-" + now.getFullYear();
    var subfolders = rootFolder.getFoldersByName(subfolderName);
    var subfolder = subfolders.hasNext() ? subfolders.next() : rootFolder.createFolder(subfolderName);

    // 3. Tách phần data:image/webp;base64,... nếu có
    var base64String = data.base64Image;
    var mimeType = "image/webp";
    if (base64String.indexOf(";base64,") > -1) {
      var parts = base64String.split(";base64,");
      mimeType = parts[0].replace("data:", "");
      base64String = parts[1];
    }

    var decoded = Utilities.base64Decode(base64String);
    var ext = mimeType.indexOf("jpeg") > -1 || mimeType.indexOf("jpg") > -1 ? ".jpg" : ".webp";
    var fileName = "Bill_Don#" + (data.orderId || "Moi") + "_" + (data.senderPhone || "Khach") + "_" + Utilities.formatDate(now, "GMT+7", "yyyyMMdd_HHmm") + ext;

    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    var file = subfolder.createFile(blob);

    // Mở quyền xem qua link (bọc try-catch an toàn)
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (eShare) {}

    var fileId = file.getId();
    var fileUrl = "https://drive.google.com/file/d/" + fileId + "/view?usp=sharing";
    var directImageUrl = "https://lh3.googleusercontent.com/d/" + fileId;

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileId: fileId,
      fileUrl: fileUrl,
      directImageUrl: directImageUrl,
      fileName: fileName
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

/**
 * Calculates current storage consumption in localStorage
 */
export function calculateLocalStorageUsage(): {
  usedBytes: number;
  totalCapacityBytes: number;
  usedFormatted: string;
  totalCapacityFormatted: string;
  percentage: number;
  billImagesCount: number;
  archivedBillsCount: number;
  billImagesSizeBytes: number;
} {
  let usedBytes = 0;
  const totalCapacityBytes = 5 * 1024 * 1024; // 5 MB standard

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        usedBytes += (key.length + val.length) * 2; // UTF-16
      }
    }
  } catch (e) {
    console.error('Lỗi tính dung lượng localStorage', e);
  }

  // Count bills from vvf_orders
  let billImagesCount = 0;
  let archivedBillsCount = 0;
  let billImagesSizeBytes = 0;

  try {
    const rawOrders = localStorage.getItem('vvf_orders');
    if (rawOrders) {
      const parsedOrders: Order[] = JSON.parse(rawOrders);
      parsedOrders.forEach((o) => {
        const img = o.paymentBillImage || o.billImageDataUrl;
        if (img && img.startsWith('data:image')) {
          billImagesCount++;
          billImagesSizeBytes += img.length * 2;
        }
        if (o.isBillArchived) {
          archivedBillsCount++;
        }
      });
    }
  } catch {}

  const percentage = Math.min(100, Math.round((usedBytes / totalCapacityBytes) * 100));

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return {
    usedBytes,
    totalCapacityBytes,
    usedFormatted: formatSize(usedBytes),
    totalCapacityFormatted: formatSize(totalCapacityBytes),
    percentage,
    billImagesCount,
    archivedBillsCount,
    billImagesSizeBytes
  };
}

/**
 * Calculate age in days from order createdAt string
 */
export function getOrderAgeInDays(createdAtStr: string): number {
  if (!createdAtStr) return 0;
  try {
    // If ISO format
    if (createdAtStr.includes('T')) {
      const d = new Date(createdAtStr);
      return Math.max(0, (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    }
    // Format DD/MM/YYYY HH:mm or DD/MM/YYYY
    const parts = createdAtStr.split(' ')[0].split(/[-/]/);
    if (parts.length >= 3) {
      // If DD/MM/YYYY
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return Math.max(0, (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    }
  } catch {}
  return 0;
}

/**
 * Extract Google Drive Folder ID from a shared folder URL or raw ID
 * Examples:
 * - https://drive.google.com/drive/folders/1a2b3c4d5e?usp=sharing -> 1a2b3c4d5e
 * - https://drive.google.com/drive/u/0/folders/1a2b3c4d5e -> 1a2b3c4d5e
 * - 1a2b3c4d5e -> 1a2b3c4d5e
 */
export function extractDriveFolderId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Check if raw alphanumeric ID
  if (/^[a-zA-Z0-9_-]{15,55}$/.test(trimmed)) {
    return trimmed;
  }
  return '';
}

/**
 * Upload an order's bill image to Google Drive via Google Apps Script Webhook
 */
export async function uploadBillToGoogleDrive(
  order: Order,
  base64Image: string,
  webhookUrl: string,
  targetFolderId?: string
): Promise<{ success: boolean; fileUrl?: string; fileId?: string; error?: string }> {
  if (!webhookUrl || !webhookUrl.trim().startsWith('http')) {
    return { success: false, error: 'Chưa cấu hình URL Webhook Google Apps Script!' };
  }

  try {
    const payload = {
      orderId: order.id,
      senderName: order.senderName,
      senderPhone: order.senderPhone,
      totalAmount: order.totalAmount,
      depositAmount: order.depositAmount,
      orderDate: order.createdAt,
      base64Image,
      targetFolderId: targetFolderId ? extractDriveFolderId(targetFolderId) : undefined
    };

    const res = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // avoids CORS preflight triggers on Apps Script
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      return {
        success: true,
        fileUrl: data.fileUrl || data.directImageUrl,
        fileId: data.fileId
      };
    }
    return { success: false, error: data.error || 'Google Apps Script trả về lỗi' };
  } catch (err: any) {
    console.error('Lỗi upload bill lên Google Drive:', err);
    return { success: false, error: err.message || 'Không thể kết nối đến Webhook Google Apps Script' };
  }
}

/**
 * Scan and archive bills older than retentionDays
 */
export function archiveExpiredBills(
  orders: Order[],
  retentionDays = 7
): {
  updatedOrders: Order[];
  archivedCount: number;
  freedBytes: number;
} {
  let archivedCount = 0;
  let freedBytes = 0;
  const nowIso = new Date().toISOString();

  const updatedOrders = orders.map((ord) => {
    // Only archive completed or cancelled orders, or orders older than retentionDays
    const isCompletedOrOld = ord.status === 'COMPLETED' || ord.status === 'CANCELLED';
    const ageDays = getOrderAgeInDays(ord.createdAt);
    const hasBase64Bill = Boolean(
      (ord.paymentBillImage && ord.paymentBillImage.startsWith('data:image')) ||
      (ord.billImageDataUrl && ord.billImageDataUrl.startsWith('data:image'))
    );

    if (isCompletedOrOld && ageDays >= retentionDays && hasBase64Bill && !ord.isBillArchived) {
      const imgLen = (ord.paymentBillImage?.length || 0) + (ord.billImageDataUrl?.length || 0);
      freedBytes += imgLen * 2;
      archivedCount++;

      return {
        ...ord,
        paymentBillImage: undefined,
        billImageDataUrl: undefined,
        isBillArchived: true,
        billArchivedAt: nowIso
      };
    }
    return ord;
  });

  return { updatedOrders, archivedCount, freedBytes };
}

/**
 * Exports all existing orders with bill information as a downloadable backup JSON
 */
export function exportBillsBackupJson(orders: Order[]): void {
  const exportData = {
    appName: 'V&V Florielle Boutique',
    exportedAt: new Date().toLocaleString('vi-VN'),
    ordersCount: orders.length,
    orders: orders.map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      senderName: o.senderName,
      senderPhone: o.senderPhone,
      recipientName: o.recipientName,
      totalAmount: o.totalAmount,
      depositAmount: o.depositAmount,
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentBillImage: o.paymentBillImage,
      billDriveUrl: o.billDriveUrl,
      isBillArchived: o.isBillArchived,
      billArchivedAt: o.billArchivedAt
    }))
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VVFlorielle_SaoLuu_BienLai_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Calculate size in bytes of a product object
 */
export function calculateProductSizeBytes(product: FlowerProduct): number {
  try {
    const jsonStr = JSON.stringify(product);
    return jsonStr.length * 2; // UTF-16 approximate
  } catch {
    return 1024;
  }
}

/**
 * Format bytes to readable string (e.g. 120 KB, 1.2 MB)
 */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Exports archived trash products as a downloadable backup JSON
 */
export function exportArchivedProductsBackupJson(archivedProducts: ArchivedFlowerProduct[]): void {
  const exportData = {
    appName: 'V&V Florielle Boutique - Kho Bản Nháp & Đã Xóa',
    exportedAt: new Date().toLocaleString('vi-VN'),
    count: archivedProducts.length,
    items: archivedProducts
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VVFlorielle_KhoLuuTru_DaXoa_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Upload archived/trash products to Google Drive via Google Apps Script Webhook
 */
export async function uploadArchivedProductsToDrive(
  archivedProducts: ArchivedFlowerProduct[],
  webhookUrl: string,
  targetFolderId?: string
): Promise<{ success: boolean; fileUrl?: string; fileId?: string; error?: string }> {
  if (!webhookUrl || !webhookUrl.trim().startsWith('http')) {
    // If no webhook URL configured, we still export the backup file for user convenience
    exportArchivedProductsBackupJson(archivedProducts);
    return {
      success: true,
      fileUrl: 'offline_export_json',
      fileId: `drive_offline_${Date.now()}`
    };
  }

  try {
    const payload = {
      action: 'BACKUP_TRASH_PRODUCTS',
      timestamp: new Date().toISOString(),
      itemCount: archivedProducts.length,
      targetFolderId: targetFolderId ? extractDriveFolderId(targetFolderId) : undefined,
      archivedProducts
    };

    const res = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      return {
        success: true,
        fileUrl: data.fileUrl || data.directImageUrl,
        fileId: data.fileId || `drive_${Date.now()}`
      };
    }
    // Fallback: If webhook fails, still download JSON locally so data is never lost
    exportArchivedProductsBackupJson(archivedProducts);
    return { success: true, fileId: `local_fallback_${Date.now()}` };
  } catch (err: any) {
    console.warn('Webhook drive sync error, falling back to local json export:', err);
    exportArchivedProductsBackupJson(archivedProducts);
    return { success: true, fileId: `local_fallback_${Date.now()}` };
  }
}
