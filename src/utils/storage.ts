import { User, EmergencyInfo, QRCode } from '../types';

const STORAGE_KEYS = {
  USERS: 'lifelink_users',
  CURRENT_USER: 'lifelink_current_user',
  EMERGENCY_INFO: 'lifelink_emergency_info',
  QR_CODES: 'lifelink_qr_codes',
};

export const storage = {
  // User management
  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (user: User): void => {
    const users = storage.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Emergency info management
  getEmergencyInfo: (): EmergencyInfo[] => {
    const info = localStorage.getItem(STORAGE_KEYS.EMERGENCY_INFO);
    return info ? JSON.parse(info) : [];
  },

  saveEmergencyInfo: (info: EmergencyInfo): void => {
    const allInfo = storage.getEmergencyInfo();
    const existingIndex = allInfo.findIndex(i => i.id === info.id);
    if (existingIndex >= 0) {
      allInfo[existingIndex] = info;
    } else {
      allInfo.push(info);
    }
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_INFO, JSON.stringify(allInfo));
  },

  getEmergencyInfoByQR: (qrCode: string): EmergencyInfo | null => {
    const allInfo = storage.getEmergencyInfo();
    return allInfo.find(info => info.qrCode === qrCode && info.isActive) || null;
  },

  // QR codes management
  getQRCodes: (): QRCode[] => {
    const codes = localStorage.getItem(STORAGE_KEYS.QR_CODES);
    return codes ? JSON.parse(codes) : [];
  },

  saveQRCode: (qrCode: QRCode): void => {
    const codes = storage.getQRCodes();
    const existingIndex = codes.findIndex(c => c.id === qrCode.id);
    if (existingIndex >= 0) {
      codes[existingIndex] = qrCode;
    } else {
      codes.push(qrCode);
    }
    localStorage.setItem(STORAGE_KEYS.QR_CODES, JSON.stringify(codes));
  },

  findQRCode: (code: string): QRCode | null => {
    const codes = storage.getQRCodes();
    return codes.find(c => c.code === code) || null;
  },

  incrementScanCount: (qrCode: string): void => {
    const codes = storage.getQRCodes();
    const code = codes.find(c => c.code === qrCode);
    if (code) {
      code.scansCount += 1;
      storage.saveQRCode(code);
    }
  },
};
