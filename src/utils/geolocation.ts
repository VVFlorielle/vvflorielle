import { HANOI_DISTRICTS } from '../data/hanoiLocations';

// Geolocation & Urban Road Distance Calculator for V&V Florielle
// Base origin: 105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội (21.0402, 105.7778)

export const SHOWROOM_COORDS = {
  lat: 21.0402,
  lng: 105.7778,
  address: '105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội'
};

// Urban Road Curvature factor for Hanoi street network (straight-line to actual street route)
const HANOI_URBAN_ROAD_FACTOR = 1.28;

export interface GeolocationResult {
  lat: number;
  lng: number;
  distanceKm: number;
  districtId: string;
  wardName: string;
  suggestedAddress: string;
  isWithinHanoi: boolean;
  warnOverDistance: boolean;
}

export interface HanoiDistrictCenter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  defaultWard: string;
}

export const HANOI_DISTRICT_CENTERS: HanoiDistrictCenter[] = [
  { id: 'cau-giay', name: 'Quận Cầu Giấy', lat: 21.036, lng: 105.7905, defaultWard: 'Phường Mai Dịch' },
  { id: 'nam-tu-liem', name: 'Quận Nam Từ Liêm', lat: 21.018, lng: 105.765, defaultWard: 'Phường Mỹ Đình 2' },
  { id: 'bac-tu-liem', name: 'Quận Bắc Từ Liêm', lat: 21.065, lng: 105.755, defaultWard: 'Phường Cổ Nhuế 1' },
  { id: 'ba-dinh', name: 'Quận Ba Đình', lat: 21.034, lng: 105.824, defaultWard: 'Phường Liễu Giai' },
  { id: 'dong-da', name: 'Quận Đống Đa', lat: 21.017, lng: 105.827, defaultWard: 'Phường Láng Hạ' },
  { id: 'tay-ho', name: 'Quận Tây Hồ', lat: 21.06, lng: 105.818, defaultWard: 'Phường Bưởi' },
  { id: 'thanh-xuan', name: 'Quận Thanh Xuân', lat: 20.998, lng: 105.811, defaultWard: 'Phường Nhân Chính' },
  { id: 'hoan-kiem', name: 'Quận Hoàn Kiếm', lat: 21.028, lng: 105.852, defaultWard: 'Phường Tràng Tiền' },
  { id: 'hai-ba-trung', name: 'Quận Hai Bà Trưng', lat: 21.008, lng: 105.855, defaultWard: 'Phường Lê Đại Hành' },
  { id: 'hoang-mai', name: 'Quận Hoàng Mai', lat: 20.978, lng: 105.845, defaultWard: 'Phường Định Công' },
  { id: 'long-bien', name: 'Quận Long Biên', lat: 21.045, lng: 105.885, defaultWard: 'Phường Bồ Đề' },
  { id: 'ha-dong', name: 'Quận Hà Đông', lat: 20.97, lng: 105.775, defaultWard: 'Phường Mộ Lao' },
  { id: 'hoai-duc', name: 'Huyện Hoài Đức', lat: 21.025, lng: 105.705, defaultWard: 'Thị trấn Trạm Trôi' },
  { id: 'dan-phuong', name: 'Huyện Đan Phượng', lat: 21.115, lng: 105.67, defaultWard: 'Thị trấn Phùng' },
  { id: 'thanh-tri', name: 'Huyện Thanh Trì', lat: 20.95, lng: 105.84, defaultWard: 'Thị trấn Văn Điển' },
  { id: 'gia-lam', name: 'Huyện Gia Lâm', lat: 21.02, lng: 105.93, defaultWard: 'Thị trấn Trâu Quỳ' },
  { id: 'dong-anh', name: 'Huyện Đông Anh', lat: 21.14, lng: 105.84, defaultWard: 'Thị trấn Đông Anh' },
  { id: 'me-linh', name: 'Huyện Mê Linh', lat: 21.18, lng: 105.72, defaultWard: 'Xã Tiền Phong' },
  { id: 'soc-son', name: 'Huyện Sóc Sơn', lat: 21.27, lng: 105.84, defaultWard: 'Thị trấn Sóc Sơn' },
  { id: 'son-tay', name: 'Thị xã Sơn Tây', lat: 21.135, lng: 105.5, defaultWard: 'Phường Lê Lợi' }
];

/**
 * Standard Haversine distance formula between two GPS coordinates (in km)
 */
export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates estimated road delivery distance from Showroom to target coordinates
 */
export function calculateDeliveryKmFromCoords(lat: number, lng: number): number {
  const straightLine = calculateHaversineKm(
    SHOWROOM_COORDS.lat,
    SHOWROOM_COORDS.lng,
    lat,
    lng
  );
  // Apply urban road curvature factor, minimum 1.0 km, round to 1 decimal place
  const roadEst = Math.max(1.0, straightLine * HANOI_URBAN_ROAD_FACTOR);
  return Math.round(roadEst * 10) / 10;
}

/**
 * Find nearest Hanoi district from GPS coordinates
 */
export function findNearestDistrict(lat: number, lng: number): HanoiDistrictCenter {
  let nearest = HANOI_DISTRICT_CENTERS[0];
  let minDistance = Infinity;

  for (const dist of HANOI_DISTRICT_CENTERS) {
    const d = calculateHaversineKm(lat, lng, dist.lat, dist.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = dist;
    }
  }

  return nearest;
}

export interface DevicePosition {
  lat: number;
  lng: number;
  accuracy: number;
}

export interface DetailedGeolocationResult extends GeolocationResult {
  accuracy: number;
  detailedAddress?: string;
  roadName?: string;
  houseNumber?: string;
  fullAddress?: string;
}

/**
 * Request device location via HTML5 Geolocation API with high accuracy (10-20m target)
 * maximumAge: 0 forces a fresh satellite/Wi-Fi fix instead of stale cache
 */
export function getCurrentDevicePosition(): Promise<DevicePosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Thiết bị hoặc trình duyệt của bạn không hỗ trợ định vị GPS.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 15
        });
      },
      (err) => {
        let msg = 'Không thể lấy vị trí hiện tại.';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            msg = 'Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép quyền vị trí trên trình duyệt hoặc chọn Quận/Huyện thủ công.';
            break;
          case err.POSITION_UNAVAILABLE:
            msg = 'Tín hiệu GPS không khả dụng hoặc thiết bị đang tắt định vị.';
            break;
          case err.TIMEOUT:
            msg = 'Quá thời gian xác định vị trí. Vui lòng thử lại hoặc chọn thủ công.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0 // Bắt buộc lấy toạ độ thời gian thực, không lấy cache cũ
      }
    );
  });
}

/**
 * Reverse Geocode via OpenStreetMap Nominatim with graceful fallback
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number
): Promise<{
  houseNumber?: string;
  road?: string;
  detailedAddress?: string;
  wardName?: string;
  districtId?: string;
  fullAddress?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=vi`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return {};

    const data = await res.json();
    const addr = data.address || {};

    const houseNumber = addr.house_number || '';
    const road = addr.road || addr.street || addr.pedestrian || addr.highway || addr.suburb || '';
    const detailedAddress = [houseNumber, road].filter(Boolean).join(', ');

    // Extract ward / quarter / village / suburb candidates
    const rawWardCandidates = [
      addr.village,
      addr.suburb,
      addr.quarter,
      addr.neighbourhood,
      addr.city_district,
      addr.town
    ].filter(Boolean) as string[];

    // Extract district text candidates from all address metadata and display_name
    const rawDistrictCandidates = [
      addr.county,
      addr.district,
      addr.city_district,
      addr.town,
      addr.suburb,
      data.display_name
    ].filter(Boolean) as string[];
    const combinedDistrictText = rawDistrictCandidates.join(' ').toLowerCase();

    // 1. Try matching district name in combined address text
    let matchedDistrict = HANOI_DISTRICTS.find((d) => {
      const cleanName = d.name.toLowerCase().replace('quận ', '').replace('huyện ', '').replace('thị xã ', '').trim();
      return combinedDistrictText.includes(cleanName);
    });

    // 2. If not matched yet, check if any ward name across all districts appears in address text
    if (!matchedDistrict) {
      for (const d of HANOI_DISTRICTS) {
        for (const w of d.wards) {
          const cleanWard = w.name.toLowerCase().replace('phường ', '').replace('xã ', '').replace('thị trấn ', '').trim();
          if (cleanWard.length > 2 && combinedDistrictText.includes(cleanWard)) {
            matchedDistrict = d;
            break;
          }
        }
        if (matchedDistrict) break;
      }
    }

    // 3. Fallback to nearest district center based on Haversine coordinates
    const nearest = findNearestDistrict(lat, lng);
    if (!matchedDistrict) {
      matchedDistrict = HANOI_DISTRICTS.find((d) => d.id === nearest.id) || HANOI_DISTRICTS[0];
    }

    // 4. Match ward inside the matched district
    let matchedWard = (nearest.id === matchedDistrict.id && nearest.defaultWard)
      ? nearest.defaultWard
      : matchedDistrict.wards[0].name;

    for (const rawWard of rawWardCandidates) {
      const cleanRawWard = rawWard.toLowerCase().replace('phường ', '').replace('xã ', '').replace('thị trấn ', '').trim();
      if (cleanRawWard.length > 1) {
        const found = matchedDistrict.wards.find((w) => {
          const cleanW = w.name.toLowerCase().replace('phường ', '').replace('xã ', '').replace('thị trấn ', '').trim();
          return cleanW.includes(cleanRawWard) || cleanRawWard.includes(cleanW);
        });
        if (found) {
          matchedWard = found.name;
          break;
        }
      }
    }

    return {
      houseNumber,
      road,
      detailedAddress: detailedAddress || `${road}`,
      wardName: matchedWard,
      districtId: matchedDistrict.id,
      fullAddress: data.display_name
    };
  } catch {
    // Network timeout or offline: fallback smoothly
    return {};
  }
}

/**
 * Full GPS Resolution Pipeline with Reverse Geocoding and Address Auto-fill
 */
export async function resolveCurrentLocationWithAddress(): Promise<DetailedGeolocationResult> {
  const coords = await getCurrentDevicePosition();
  const distanceKm = calculateDeliveryKmFromCoords(coords.lat, coords.lng);
  const nearest = findNearestDistrict(coords.lat, coords.lng);

  // Try reverse geocoding
  const geoAddress = await reverseGeocodeCoordinates(coords.lat, coords.lng);

  const districtId = geoAddress.districtId || nearest.id;
  const wardName = geoAddress.wardName || nearest.defaultWard;
  const detailedAddress = geoAddress.detailedAddress || '';

  const isWithinHanoi = distanceKm <= 60;
  const warnOverDistance = distanceKm > 20;

  return {
    lat: coords.lat,
    lng: coords.lng,
    accuracy: coords.accuracy,
    distanceKm,
    districtId,
    wardName,
    detailedAddress,
    roadName: geoAddress.road,
    houseNumber: geoAddress.houseNumber,
    fullAddress: geoAddress.fullAddress,
    suggestedAddress: detailedAddress
      ? `${detailedAddress}, ${wardName}, Hà Nội`
      : `${wardName}, ${nearest.name}, Hà Nội`,
    isWithinHanoi,
    warnOverDistance
  };
}

/**
 * Backwards-compatible resolveCurrentLocation
 */
export async function resolveCurrentLocation(): Promise<GeolocationResult> {
  const res = await resolveCurrentLocationWithAddress();
  return {
    lat: res.lat,
    lng: res.lng,
    distanceKm: res.distanceKm,
    districtId: res.districtId,
    wardName: res.wardName,
    suggestedAddress: res.suggestedAddress,
    isWithinHanoi: res.isWithinHanoi,
    warnOverDistance: res.warnOverDistance
  };
}
