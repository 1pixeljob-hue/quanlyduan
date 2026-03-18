import { Hosting } from '../App';

export function generateICS(hosting: Hosting): string {
  const formatDateToICS = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const expirationDate = new Date(hosting.expirationDate);
  const reminderDate7Days = new Date(expirationDate);
  reminderDate7Days.setDate(expirationDate.getDate() - 7);
  
  const reminderDate1Day = new Date(expirationDate);
  reminderDate1Day.setDate(expirationDate.getDate() - 1);

  const now = new Date();
  const dtstamp = formatDateToICS(now);

  // Main event - Expiration date
  const mainEventStart = formatDateToICS(expirationDate);
  const mainEventEnd = formatDateToICS(new Date(expirationDate.getTime() + 60 * 60 * 1000)); // 1 hour later

  // 7 days reminder
  const reminder7Start = formatDateToICS(reminderDate7Days);
  const reminder7End = formatDateToICS(new Date(reminderDate7Days.getTime() + 60 * 60 * 1000));

  // 1 day reminder
  const reminder1Start = formatDateToICS(reminderDate1Day);
  const reminder1End = formatDateToICS(new Date(reminderDate1Day.getTime() + 60 * 60 * 1000));

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//1Pixel Hosting Manager//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Hosting Renewals
X-WR-TIMEZONE:Asia/Ho_Chi_Minh

BEGIN:VEVENT
UID:hosting-${hosting.id}-expiration@1pixel.com
DTSTAMP:${dtstamp}
DTSTART:${mainEventStart}
DTEND:${mainEventEnd}
SUMMARY:⚠️ HẾT HẠN: ${hosting.name}
DESCRIPTION:Hosting "${hosting.name}" sẽ hết hạn hôm nay!\\n\\nThông tin chi tiết:\\n- Domain: ${hosting.domain}\\n- Nhà cung cấp: ${hosting.provider}\\n- Giá: ${hosting.price.toLocaleString('vi-VN')} VNĐ\\n- Ngày đăng ký: ${new Date(hosting.registrationDate).toLocaleDateString('vi-VN')}\\n${hosting.notes ? '- Ghi chú: ' + hosting.notes : ''}\\n\\nVui lòng gia hạn ngay để tránh gián đoạn dịch vụ!
LOCATION:${hosting.provider}
STATUS:CONFIRMED
PRIORITY:9
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:Hosting ${hosting.name} sẽ hết hạn trong 2 giờ nữa!
END:VALARM
END:VEVENT

BEGIN:VEVENT
UID:hosting-${hosting.id}-reminder7@1pixel.com
DTSTAMP:${dtstamp}
DTSTART:${reminder7Start}
DTEND:${reminder7End}
SUMMARY:🔔 Nhắc nhở: Hosting ${hosting.name} sắp hết hạn
DESCRIPTION:Hosting "${hosting.name}" sẽ hết hạn sau 7 ngày!\\n\\nThông tin chi tiết:\\n- Domain: ${hosting.domain}\\n- Nhà cung cấp: ${hosting.provider}\\n- Ngày hết hạn: ${new Date(hosting.expirationDate).toLocaleDateString('vi-VN')}\\n- Giá: ${hosting.price.toLocaleString('vi-VN')} VNĐ\\n${hosting.notes ? '- Ghi chú: ' + hosting.notes : ''}\\n\\nChuẩn bị gia hạn trong thời gian tới.
LOCATION:${hosting.provider}
STATUS:CONFIRMED
PRIORITY:5
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Nhắc nhở: Hosting ${hosting.name} còn 7 ngày nữa hết hạn
END:VALARM
END:VEVENT

BEGIN:VEVENT
UID:hosting-${hosting.id}-reminder1@1pixel.com
DTSTAMP:${dtstamp}
DTSTART:${reminder1Start}
DTEND:${reminder1End}
SUMMARY:⏰ URGENT: Hosting ${hosting.name} hết hạn ngày mai!
DESCRIPTION:Hosting "${hosting.name}" sẽ hết hạn vào NGÀY MAI!\\n\\nThông tin chi tiết:\\n- Domain: ${hosting.domain}\\n- Nhà cung cấp: ${hosting.provider}\\n- Ngày hết hạn: ${new Date(hosting.expirationDate).toLocaleDateString('vi-VN')}\\n- Giá: ${hosting.price.toLocaleString('vi-VN')} VNĐ\\n${hosting.notes ? '- Ghi chú: ' + hosting.notes : ''}\\n\\nGIA HẠN NGAY để tránh mất dịch vụ!
LOCATION:${hosting.provider}
STATUS:CONFIRMED
PRIORITY:9
BEGIN:VALARM
TRIGGER:-PT4H
ACTION:DISPLAY
DESCRIPTION:URGENT: Hosting ${hosting.name} sẽ hết hạn vào ngày mai!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT12H
ACTION:DISPLAY
DESCRIPTION:URGENT: Hosting ${hosting.name} còn 1 ngày nữa hết hạn!
END:VALARM
END:VEVENT

END:VCALENDAR`;

  return icsContent;
}

export function downloadICS(hosting: Hosting): void {
  const icsContent = generateICS(hosting);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hosting-${hosting.domain}-renewal.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadMultipleICS(hostings: Hosting[]): void {
  if (hostings.length === 0) return;

  const formatDateToICS = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const now = new Date();
  const dtstamp = formatDateToICS(now);

  let events = '';

  hostings.forEach(hosting => {
    const expirationDate = new Date(hosting.expirationDate);
    const reminderDate7Days = new Date(expirationDate);
    reminderDate7Days.setDate(expirationDate.getDate() - 7);
    
    const reminderDate1Day = new Date(expirationDate);
    reminderDate1Day.setDate(expirationDate.getDate() - 1);

    const mainEventStart = formatDateToICS(expirationDate);
    const mainEventEnd = formatDateToICS(new Date(expirationDate.getTime() + 60 * 60 * 1000));

    const reminder7Start = formatDateToICS(reminderDate7Days);
    const reminder7End = formatDateToICS(new Date(reminderDate7Days.getTime() + 60 * 60 * 1000));

    const reminder1Start = formatDateToICS(reminderDate1Day);
    const reminder1End = formatDateToICS(new Date(reminderDate1Day.getTime() + 60 * 60 * 1000));

    events += `
BEGIN:VEVENT
UID:hosting-${hosting.id}-expiration@1pixel.com
DTSTAMP:${dtstamp}
DTSTART:${mainEventStart}
DTEND:${mainEventEnd}
SUMMARY:⚠️ HẾT HẠN: ${hosting.name}
DESCRIPTION:Hosting "${hosting.name}" sẽ hết hạn hôm nay!\\n\\nThông tin chi tiết:\\n- Domain: ${hosting.domain}\\n- Nhà cung cấp: ${hosting.provider}\\n- Giá: ${hosting.price.toLocaleString('vi-VN')} VNĐ\\n- Ngày đăng ký: ${new Date(hosting.registrationDate).toLocaleDateString('vi-VN')}\\n${hosting.notes ? '- Ghi chú: ' + hosting.notes : ''}\\n\\nVui lòng gia hạn ngay để tránh gián đoạn dịch vụ!
LOCATION:${hosting.provider}
STATUS:CONFIRMED
PRIORITY:9
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:Hosting ${hosting.name} sẽ hết hạn trong 2 giờ nữa!
END:VALARM
END:VEVENT

BEGIN:VEVENT
UID:hosting-${hosting.id}-reminder7@1pixel.com
DTSTAMP:${dtstamp}
DTSTART:${reminder7Start}
DTEND:${reminder7End}
SUMMARY:🔔 Nhắc nhở: Hosting ${hosting.name} sắp hết hạn
DESCRIPTION:Hosting "${hosting.name}" sẽ hết hạn sau 7 ngày!\\n\\nThông tin chi tiết:\\n- Domain: ${hosting.domain}\\n- Nhà cung cấp: ${hosting.provider}\\n- Ngày hết hạn: ${new Date(hosting.expirationDate).toLocaleDateString('vi-VN')}\\n- Giá: ${hosting.price.toLocaleString('vi-VN')} VNĐ\\n${hosting.notes ? '- Ghi chú: ' + hosting.notes : ''}\\n\\nChuẩn bị gia hạn trong thời gian tới.
LOCATION:${hosting.provider}
STATUS:CONFIRMED
PRIORITY:5
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Nhắc nhở: Hosting ${hosting.name} còn 7 ngày nữa hết hạn
END:VALARM
END:VEVENT

BEGIN:VEVENT
UID:hosting-${hosting.id}-reminder1@1pixel.com
DTSTAMP:${dtstamp}
DTSTART:${reminder1Start}
DTEND:${reminder1End}
SUMMARY:⏰ URGENT: Hosting ${hosting.name} hết hạn ngày mai!
DESCRIPTION:Hosting "${hosting.name}" sẽ hết hạn vào NGÀY MAI!\\n\\nThông tin chi tiết:\\n- Domain: ${hosting.domain}\\n- Nhà cung cấp: ${hosting.provider}\\n- Ngày hết hạn: ${new Date(hosting.expirationDate).toLocaleDateString('vi-VN')}\\n- Giá: ${hosting.price.toLocaleString('vi-VN')} VNĐ\\n${hosting.notes ? '- Ghi chú: ' + hosting.notes : ''}\\n\\nGIA HẠN NGAY để tránh mất dịch vụ!
LOCATION:${hosting.provider}
STATUS:CONFIRMED
PRIORITY:9
BEGIN:VALARM
TRIGGER:-PT4H
ACTION:DISPLAY
DESCRIPTION:URGENT: Hosting ${hosting.name} sẽ hết hạn vào ngày mai!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT12H
ACTION:DISPLAY
DESCRIPTION:URGENT: Hosting ${hosting.name} còn 1 ngày nữa hết hạn!
END:VALARM
END:VEVENT
`;
  });

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//1Pixel Hosting Manager//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Hosting Renewals
X-WR-TIMEZONE:Asia/Ho_Chi_Minh
${events}
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `all-hosting-renewals-${new Date().toISOString().split('T')[0]}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
