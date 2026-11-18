/**
 * Gemini Vision Service for Automatic Payment Receipt Verification
 * Tiệm Hoa V&V Florielle
 *
 * Uses Google Gemini 1.5 Flash / 2.0 Flash Multimodal Vision API to inspect
 * uploaded VietQR/bank transfer receipts, extract transaction metadata,
 * verify amounts, and auto-approve deposits.
 */

export interface AnalyzeBillParams {
  apiKey: string;
  billImageDataUrl: string;
  orderId: string;
  depositAmount: number;
  totalAmount: number;
  senderName?: string;
  expectedBankName?: string;
  expectedBankAccount?: string;
  expectedBankOwner?: string;
}

export interface AiBillAnalysisResult {
  success: boolean;
  verifiedAt: string;
  isValidBill: boolean;
  isSuccess: boolean;
  bankName?: string;
  transferredAmount?: number;
  recipientName?: string;
  recipientAccountNumber?: string;
  transactionId?: string;
  transactionTime?: string;
  transferContent?: string;
  confidenceScore: number;
  decision: 'APPROVE' | 'REJECT' | 'NEEDS_REVIEW';
  summary: string;
  modelUsed?: string;
  error?: string;
  rawResponse?: string;
}

const CANDIDATE_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash'];

/**
 * Extracts pure Base64 and mime type from a data URL string.
 */
function extractBase64AndMime(dataUrl: string): { mimeType: string; base64Data: string } {
  let mimeType = 'image/jpeg';
  let base64Data = dataUrl;

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (match) {
    mimeType = match[1];
    base64Data = match[2];
  }

  return { mimeType, base64Data };
}

/**
 * Calls Gemini Multimodal Vision API to analyze payment bill receipt.
 */
export async function analyzePaymentBillWithGemini(
  params: AnalyzeBillParams
): Promise<AiBillAnalysisResult> {
  const verifiedAt = new Date().toISOString();

  if (!params.apiKey || !params.apiKey.trim()) {
    return {
      success: false,
      verifiedAt,
      isValidBill: false,
      isSuccess: false,
      confidenceScore: 0,
      decision: 'NEEDS_REVIEW',
      summary: 'Chưa cấu hình Khóa Google Gemini API. Vui lòng vào Quản trị > Bảo mật để cấu hình.',
      error: 'MISSING_API_KEY'
    };
  }

  if (!params.billImageDataUrl) {
    return {
      success: false,
      verifiedAt,
      isValidBill: false,
      isSuccess: false,
      confidenceScore: 0,
      decision: 'NEEDS_REVIEW',
      summary: 'Đơn hàng chưa có ảnh biên lai để phân tích.',
      error: 'MISSING_BILL_IMAGE'
    };
  }

  const { mimeType, base64Data } = extractBase64AndMime(params.billImageDataUrl);

  const formattedDeposit = new Intl.NumberFormat('vi-VN').format(params.depositAmount);
  const formattedTotal = new Intl.NumberFormat('vi-VN').format(params.totalAmount);

  const systemInstruction = `Bạn là Chuyên viên Giám định Tài chính & Đối soát Ngân hàng AI của "Tiệm Hoa V&V Florielle" (Hà Nội).
Nhiệm vụ: Phân tích ảnh chụp màn hình chuyển khoản / biên lai ngân hàng của khách hàng để quyết định duyệt cọc tự động.

THÔNG TIN ĐƠN HÀNG CẦN ĐỐI SOÁT:
- Mã đơn hàng: #${params.orderId}
- Số tiền cọc 50% yêu cầu: ${formattedDeposit} VNĐ (Tổng giá trị đơn: ${formattedTotal} VNĐ)
- Khách đặt hoa: ${params.senderName || 'Khách hàng'}
- Tài khoản nhận chuẩn của tiệm: Ngân hàng ${params.expectedBankName || 'Vietcombank'} - STK: ${params.expectedBankAccount || '1909203...'} - Chủ TK: ${params.expectedBankOwner || 'V&V FLORIELLE'}

QUY TẮC THẨM ĐỊNH TÀI CHÍNH:
1. Xác định ảnh có phải là biên lai thanh toán / màn hình banking giao dịch thành công (Vietcombank, MB, Techcombank, VPBank, VietinBank, BIDV, MoMo, ZaloPay...) hay không.
2. Trích xuất chính xác:
   - Số tiền chuyển thực tế (dưới dạng số nguyên VNĐ, ví dụ: 250000, không chứa dấu chấm hay phẩy)
   - Tên ngân hàng gửi/nhận
   - Tên người nhận và số tài khoản nhận (nếu hiển thị)
   - Mã giao dịch / Mã tham chiếu ngân hàng
   - Thời gian giao dịch
   - Nội dung chuyển khoản (có chứa mã đơn #${params.orderId} hay không)
3. Đưa ra quyết định (decision):
   - "APPROVE": Ảnh là biên lai chuyển khoản ngân hàng thành công rõ ràng, số tiền thực chuyển >= số tiền cọc yêu cầu (${params.depositAmount} VNĐ).
   - "NEEDS_REVIEW": Số tiền thực chuyển nhỏ hơn số tiền cọc, hoặc ảnh bị mờ/che một phần số tiền, hoặc thời gian giao dịch cũ/bất thường, hoặc số tài khoản nhận không khớp.
   - "REJECT": Ảnh hoàn toàn KHÔNG phải là biên lai chuyển tiền (ví dụ ảnh chụp cảnh vật, ảnh hoa, ảnh selfie, meme, rác), hoặc giao dịch hiển thị rõ "Thất bại" / "Đã hủy".

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:
Trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm markdown ngoài, không kèm lời giải thích thừa), theo cấu trúc:
{
  "isValidBill": true,
  "isSuccess": true,
  "bankName": "Vietcombank",
  "transferredAmount": 250000,
  "recipientName": "V&V FLORIELLE",
  "recipientAccountNumber": "1909203...",
  "transactionId": "FT2401019999",
  "transactionTime": "14:35:12 18/11/2026",
  "transferContent": "DH123456 coc hoa",
  "confidenceScore": 95,
  "decision": "APPROVE",
  "summary": "Biên lai Vietcombank chuyển thành công 250.000đ, khớp số tiền cọc đơn #${params.orderId}."
}`;

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${params.apiKey.trim()}`;

      const requestBody = {
        contents: [
          {
            parts: [
              { text: systemInstruction },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 0.95
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Gemini Vision] Model ${model} returned error HTTP ${response.status}:`, errorText);
        lastError = new Error(`HTTP ${response.status}: ${errorText}`);
        continue; // Try fallback model
      }

      const responseJson = await response.json();
      const rawText = responseJson.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        lastError = new Error('Phản hồi từ Gemini không có nội dung văn bản');
        continue;
      }

      // Robust JSON extraction using regex
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Gemini không trả về đúng định dạng JSON');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Enforce business validation safety rules
      let finalDecision: 'APPROVE' | 'REJECT' | 'NEEDS_REVIEW' = parsed.decision || 'NEEDS_REVIEW';
      let summary = parsed.summary || 'Đã phân tích biên lai qua AI';

      const transferredAmount = typeof parsed.transferredAmount === 'number'
        ? parsed.transferredAmount
        : parseInt(String(parsed.transferredAmount || 0).replace(/[^\d]/g, ''), 10) || 0;

      // Safety check: if amount is less than required deposit, AI must NOT auto-approve!
      if (parsed.isValidBill && parsed.isSuccess) {
        if (transferredAmount < params.depositAmount) {
          finalDecision = 'NEEDS_REVIEW';
          summary = `Số tiền chuyển (${new Intl.NumberFormat('vi-VN').format(transferredAmount)}đ) nhỏ hơn tiền cọc yêu cầu (${formattedDeposit}đ). Cần kiểm tra lại.`;
        }
      } else if (!parsed.isValidBill) {
        finalDecision = 'REJECT';
        if (!summary.includes('không phải')) {
          summary = 'Ảnh tải lên không phải là biên lai chuyển khoản ngân hàng hợp lệ.';
        }
      }

      return {
        success: true,
        verifiedAt,
        isValidBill: Boolean(parsed.isValidBill),
        isSuccess: Boolean(parsed.isSuccess),
        bankName: parsed.bankName || 'Ngân hàng',
        transferredAmount,
        recipientName: parsed.recipientName,
        recipientAccountNumber: parsed.recipientAccountNumber,
        transactionId: parsed.transactionId,
        transactionTime: parsed.transactionTime,
        transferContent: parsed.transferContent,
        confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 90,
        decision: finalDecision,
        summary,
        modelUsed: model,
        rawResponse: rawText
      };
    } catch (err: any) {
      console.error(`[Gemini Vision] Error with model ${model}:`, err);
      lastError = err;
    }
  }

  // If all models failed
  return {
    success: false,
    verifiedAt,
    isValidBill: false,
    isSuccess: false,
    confidenceScore: 0,
    decision: 'NEEDS_REVIEW',
    summary: `Không thể kết nối Gemini AI: ${lastError?.message || 'Lỗi mạng hoặc khóa API không hợp lệ'}`,
    error: lastError?.message
  };
}
