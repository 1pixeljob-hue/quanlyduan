// Vietnamese date format utilities (dd/mm/yyyy)

/**
 * Convert Date object to dd/mm/yyyy string
 */
export function formatDateVN(date: Date | string): string {
  let d: Date;
  
  if (typeof date === 'string') {
    // If ISO format (yyyy-mm-dd), parse directly to avoid timezone issues
    if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
      const parts = date.split('T')[0].split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      d = new Date(year, month, day);
    } else {
      d = new Date(date);
    }
  } else {
    d = date;
  }
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Convert dd/mm/yyyy string to Date object
 */
export function parseDateVN(dateStr: string): Date {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr); // Fallback to default parsing
}

/**
 * Convert Date object to yyyy-mm-dd (for internal storage)
 */
export function toISODateString(date: Date | string): string {
  const d = typeof date === 'string' ? parseDateVN(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert yyyy-mm-dd to dd/mm/yyyy
 */
export function isoToVNDate(isoDate: string): string {
  if (!isoDate) return '';
  
  // Parse ISO format directly to avoid timezone issues
  const parts = isoDate.split('T')[0].split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  }
  
  // Fallback to formatDateVN if format is unexpected
  return formatDateVN(isoDate);
}

/**
 * Get today in dd/mm/yyyy format
 */
export function getTodayVN(): string {
  return formatDateVN(new Date());
}

/**
 * Validate dd/mm/yyyy format
 */
export function isValidVNDate(dateStr: string): boolean {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Check ranges
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  // Check if date is valid
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && 
         date.getMonth() === month - 1 && 
         date.getFullYear() === year;
}

/**
 * Format date for display (with day name in Vietnamese)
 */
export function formatDateVNLong(date: Date | string): string {
  let d: Date;
  
  if (typeof date === 'string') {
    // If ISO format (yyyy-mm-dd), parse directly to avoid timezone issues
    if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
      const parts = date.split('T')[0].split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      d = new Date(year, month, day);
    } else {
      d = new Date(date);
    }
  } else {
    d = date;
  }
  
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = dayNames[d.getDay()];
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${dayName}, ${day}/${month}/${year}`;
}

/**
 * Calculate days until expiry from dd/mm/yyyy string
 */
export function daysUntilExpiryVN(dateStr: string): number {
  const expDate = parseDateVN(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expDate.setHours(0, 0, 0, 0);
  
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Convert internal ISO date to VN format for input value
 */
export function dateForInput(isoDate: string): string {
  if (!isoDate) return '';
  return isoToVNDate(isoDate);
}