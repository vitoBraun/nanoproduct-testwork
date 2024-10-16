import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

export const comparePassword = (
  plainPassword: string,
  hashPassword: string,
) => {
  return bcrypt.compare(plainPassword, hashPassword);
};

export const getEnvFilePath = () => {
  const filePath = process.env.NODE_ENV
    ? `.env.${process.env.NODE_ENV}`
    : '.env';

  if (!fs.existsSync(filePath)) {
    throw new InternalServerErrorException(`ENV file ${filePath} not found`);
  }

  return filePath;
};

export function validateDateFormat(dateString) {
  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  if (dateString?.match(dateFormat)) {
    return true;
  } else {
    return false;
  }
}

export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFileExtension(filename) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop() : '';
}
