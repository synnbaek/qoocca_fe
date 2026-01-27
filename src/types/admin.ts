export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page
}

export interface AcademyListResponse {
  academyId: number;
  name: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  item?: any; // 추가적인 리스트 아이템 정보가 있을 경우
}

export interface AcademyResponse {
  academyId: number;
  name: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  
  // 주소
  address?: string;
  baseAddress?: string; // 도로명
  detailAddress?: string; // 상세
  
  // 연락처
  phoneNumber?: string;
  
  // 소개
  briefInfo?: string;
  detailInfo?: string;
  costInfo?: string;
  operatingHours?: string;
  
  // 링크
  blogUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  
  // 인증서 및 이미지
  certificate?: string; // 사업자등록증 이미지 URL 등
  imageUrls?: string[];
  
  // 분류
  ages?: string[];
  subjects?: string[];
}

export interface AcademyRejectRequest {
  rejectionReason: string;
}
