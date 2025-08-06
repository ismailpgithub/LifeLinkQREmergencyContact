import { faker } from '@faker-js/faker';
import { QRCode } from '../types';
import { storage } from './storage';

export const generateMockQRCodes = (count: number = 50): void => {
  const existingCodes = storage.getQRCodes();
  if (existingCodes.length > 0) return; // Don't regenerate if codes exist

  const codes: QRCode[] = [];
  
  for (let i = 0; i < count; i++) {
    const code: QRCode = {
      id: faker.string.uuid(),
      code: `LL-${faker.string.alphanumeric(8).toUpperCase()}`,
      status: faker.helpers.arrayElement(['unused', 'unused', 'unused', 'linked']),
      createdAt: faker.date.past().toISOString(),
      scansCount: faker.number.int({ min: 0, max: 50 }),
    };
    codes.push(code);
  }

  codes.forEach(code => storage.saveQRCode(code));
};

export const getRandomUnusedQRCode = (): string => {
  const codes = storage.getQRCodes();
  const unusedCodes = codes.filter(c => c.status === 'unused');
  
  if (unusedCodes.length === 0) {
    // Generate a new random code if none available
    return `LL-${faker.string.alphanumeric(8).toUpperCase()}`;
  }
  
  return faker.helpers.arrayElement(unusedCodes).code;
};
