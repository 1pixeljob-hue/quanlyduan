/**
 * Format currency value with Vietnamese standard
 * - >= 1 billion: X.XB (ví dụ: 2.5B)
 * - >= 1 million: X.XM (ví dụ: 15.5M)
 * - >= 1 thousand: XK (ví dụ: 500K)
 * - < 1 thousand: số nguyên (ví dụ: 500)
 */
export const formatCurrency = (value: number): string => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

/**
 * Format full currency value with separators
 * Example: 15000000 => "15.000.000 VNĐ"
 */
export const formatFullCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
};
