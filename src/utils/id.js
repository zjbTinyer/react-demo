import { v4 as uuidv4 } from 'uuid';

/** 生成唯一 ID（短格式，取前 8 位） */
export function generateId() {
  return uuidv4().slice(0, 8);
}

/** 生成完整的 UUID */
export function generateFullId() {
  return uuidv4();
}

/** 生成时间戳格式：YYYY-MM-DD HH:mm:ss */
export function now() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
