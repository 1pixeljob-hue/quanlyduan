// Email utility using Resend API
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';
const COMPANY_NAME = '1Pixel - Quản lý công việc tập trung';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send email:', error);
      return false;
    }

    const data = await response.json();
    console.log('Email sent successfully:', data.id);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Generate HTML email template for hosting expiration
export function generateHostingExpirationEmail(
  hosting: any,
  daysUntilExpiry: number
): string {
  const urgencyLevel = daysUntilExpiry <= 1 ? 'critical' : daysUntilExpiry <= 7 ? 'warning' : 'info';
  const urgencyColor = urgencyLevel === 'critical' ? '#EF4444' : urgencyLevel === 'warning' ? '#F59E0B' : '#3B82F6';
  const urgencyIcon = urgencyLevel === 'critical' ? '🔴' : urgencyLevel === 'warning' ? '🟡' : '🔵';
  
  const expDate = new Date(hosting.expirationDate);
  const formattedDate = expDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nhắc nhở Hosting sắp hết hạn</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #4DBFAD 0%, #2563B4 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ${urgencyIcon} ${COMPANY_NAME}
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                Thông báo nhắc nhở tự động
              </p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background-color: ${urgencyColor}; padding: 20px 30px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">
                ⏰ Hosting sắp hết hạn ${daysUntilExpiry === 0 ? 'HÔM NAY' : `sau ${daysUntilExpiry} ngày`}!
              </h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Xin chào,
              </p>

              <!-- Hosting Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 2px solid ${urgencyColor}; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">🌐 Tên Hosting:</strong>
                          <div style="color: #4b5563; font-size: 18px; font-weight: 600; margin-top: 4px;">
                            ${hosting.name}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">🔗 Domain:</strong>
                          <div style="color: #4b5563; font-size: 16px; margin-top: 4px;">
                            ${hosting.domain}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">🏢 Nhà cung cấp:</strong>
                          <div style="color: #4b5563; font-size: 16px; margin-top: 4px;">
                            ${hosting.provider}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">📅 Ngày hết hạn:</strong>
                          <div style="color: ${urgencyColor}; font-size: 20px; font-weight: 700; margin-top: 4px;">
                            ${formattedDate}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">💰 Giá gia hạn:</strong>
                          <div style="color: #4b5563; font-size: 18px; font-weight: 600; margin-top: 4px;">
                            ${hosting.price.toLocaleString('vi-VN')} VNĐ
                          </div>
                        </td>
                      </tr>
                      ${hosting.notes ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">📝 Ghi chú:</strong>
                          <div style="color: #6b7280; font-size: 14px; margin-top: 4px; font-style: italic;">
                            ${hosting.notes}
                          </div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Items -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
                <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 600;">
                  ⚠️ Cần làm gì tiếp theo?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #78350f;">
                  <li style="margin-bottom: 8px;">Kiểm tra thông tin thanh toán</li>
                  <li style="margin-bottom: 8px;">Liên hệ nhà cung cấp để gia hạn</li>
                  <li style="margin-bottom: 8px;">Chuẩn bị ngân sách: ${hosting.price.toLocaleString('vi-VN')} VNĐ</li>
                  <li style="margin-bottom: 8px;">Cập nhật trạng thái sau khi gia hạn</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="${hosting.adminUrl || '#'}" 
                       style="display: inline-block; background: linear-gradient(135deg, #4DBFAD 0%, #2563B4 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      🔐 Truy cập Admin Panel
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                Email này được gửi tự động từ hệ thống ${COMPANY_NAME}.<br>
                Vui lòng không trả lời email này.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
                © 2026 ${COMPANY_NAME}. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                Powered by 1Pixel Technologies
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Generate HTML email template for project deadline
export function generateProjectDeadlineEmail(
  project: any,
  daysUntilDeadline: number
): string {
  const urgencyColor = daysUntilDeadline <= 1 ? '#EF4444' : daysUntilDeadline <= 7 ? '#F59E0B' : '#3B82F6';
  const urgencyIcon = daysUntilDeadline <= 1 ? '🔴' : daysUntilDeadline <= 7 ? '🟡' : '🔵';
  
  const statusText: Record<string, string> = {
    'planning': 'Lên Kế Hoạch',
    'in-progress': 'Đang Thực Hiện',
    'pending-acceptance': 'Chờ Nghiệm Thu',
    'completed': 'Hoàn Thành',
    'on-hold': 'Tạm Dừng'
  };

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nhắc nhở Project Deadline</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #4DBFAD 0%, #2563B4 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ${urgencyIcon} ${COMPANY_NAME}
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                Nhắc nhở Project Deadline
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: ${urgencyColor}; padding: 20px 30px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">
                📁 Project cần hoàn thành ${daysUntilDeadline === 0 ? 'HÔM NAY' : `sau ${daysUntilDeadline} ngày`}!
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 2px solid ${urgencyColor}; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">📁 Tên Project:</strong>
                          <div style="color: #4b5563; font-size: 18px; font-weight: 600; margin-top: 4px;">
                            ${project.name}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">👤 Khách hàng:</strong>
                          <div style="color: #4b5563; font-size: 16px; margin-top: 4px;">
                            ${project.customer} - ${project.customerPhone}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">📊 Trạng thái:</strong>
                          <div style="color: #4b5563; font-size: 16px; margin-top: 4px;">
                            ${statusText[project.status] || project.status}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">💰 Giá trị:</strong>
                          <div style="color: #4b5563; font-size: 18px; font-weight: 600; margin-top: 4px;">
                            ${project.price.toLocaleString('vi-VN')} VNĐ
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #1f2937; font-size: 14px;">📝 Mô tả:</strong>
                          <div style="color: #6b7280; font-size: 14px; margin-top: 4px;">
                            ${project.description}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${project.adminUrl ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="${project.adminUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #4DBFAD 0%, #2563B4 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      🔗 Xem Project
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                Email này được gửi tự động từ hệ thống ${COMPANY_NAME}.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
                © 2026 ${COMPANY_NAME}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Test email function
export function generateTestEmail(recipientEmail: string): string {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #4DBFAD 0%, #2563B4 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ✅ ${COMPANY_NAME}
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                Email Test - Cấu hình thành công!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">
                Email đã được cấu hình thành công!
              </h2>
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hệ thống email notifications đang hoạt động bình thường.<br>
                Email được gửi đến: <strong>${recipientEmail}</strong>
              </p>
              <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <p style="margin: 0; color: #065f46; font-size: 14px;">
                  ✨ Từ giờ bạn sẽ nhận được email tự động khi:<br>
                  • Hosting sắp hết hạn (30, 7, 1 ngày trước)<br>
                  • Project đến deadline<br>
                  • Các cảnh báo quan trọng khác
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                © 2026 ${COMPANY_NAME}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
