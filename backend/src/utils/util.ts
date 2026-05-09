import { randomUUID } from 'crypto';

// 替换文件名
export const replaceFileName = (name: string) => {
  const stringArr = name.split('.');
  stringArr[0] = randomUUID();
  return stringArr.join('.');
};
