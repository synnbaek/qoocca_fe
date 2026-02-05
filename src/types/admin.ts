export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface AcademyListResponse {
  id: number;
  academyId?: number; // 호환용
  name: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  item?: any;
}

export interface AgeGroup {
  id: number;
  ageCode: string;
}

export interface Subject {
  id: number;
  mainSubjectCode: string;
  detailSubject: string;
}

export interface AcademyResponse {
  id: number;
  academyId?: number; // 호환용
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
  
  // 분류 (JSON 구조에 맞게 수정)
  ages?: AgeGroup[];
  subjects?: Subject[];

  // 등록자(원장님) 정보
  userName?: string;
  userPhoneNumber?: string;
}

export interface AcademyRejectRequest {
  rejectionReason: string;
}