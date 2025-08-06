export interface User {
  id: string;
  email: string;
  name: string;
  qrCodes: string[];
}

export interface EmergencyInfo {
  id: string;
  qrCode: string;
  name: string;
  emergencyContact: string;
  emergencyContactName: string;
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  customMessage: string;
  isActive: boolean;
  createdAt: string;
  lastScanned?: string;
}

export interface QRCode {
  id: string;
  code: string;
  status: 'unused' | 'linked' | 'sold';
  linkedUserId?: string;
  emergencyInfoId?: string;
  createdAt: string;
  scansCount: number;
}

export interface AdminStats {
  totalCodes: number;
  linkedCodes: number;
  totalScans: number;
  activeUsers: number;
}
