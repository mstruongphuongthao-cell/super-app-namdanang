/**
 * Format currency to Vietnamese Dong (VND)
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 đ';
  }
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' đ';
}

/**
 * Format currency without symbol (just separated numbers)
 */
export function formatNumber(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('vi-VN').format(Math.round(value));
}

/**
 * Parse raw string input into clean number
 */
export function parseNumberInput(input: string): number {
  const clean = input.replace(/[^\d]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

/**
 * Format Date to DD/MM/YYYY
 */
export function formatDateVN(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
