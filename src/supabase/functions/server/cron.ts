import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';
import { sendEmail, generateHostingExpirationEmail, generateProjectDeadlineEmail } from './email.ts';

const cron = new Hono();

// Helper to get email settings
async function getEmailSettings() {
  const settings = await kv.get('email_settings');
  return settings || {
    enabled: false,
    email: '',
    notifyHosting30Days: true,
    notifyHosting7Days: true,
    notifyHosting1Day: true,
    notifyProjects: true,
  };
}

// Helper to get notification log
async function getNotificationLog() {
  const log = await kv.get('notification_log');
  return log || {};
}

// Helper to save notification log
async function saveNotificationLog(log: any) {
  await kv.set('notification_log', log);
}

// Check if notification was already sent today
function wasNotifiedToday(log: any, key: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return log[key] === today;
}

// Main cron job - Check expiring hostings and send emails
cron.post('/check-expiring-hostings', async (c) => {
  try {
    console.log('🔔 Cron job started: check-expiring-hostings');

    // Get email settings
    const settings = await getEmailSettings();
    
    if (!settings.enabled || !settings.email) {
      console.log('⚠️ Email notifications disabled or no email configured');
      return c.json({ 
        success: false, 
        message: 'Email notifications not configured' 
      });
    }

    // Get all hostings
    const hostings = await kv.getByPrefix('hosting_');
    const notificationLog = await getNotificationLog();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sentCount = 0;
    const results = [];

    for (const hosting of hostings) {
      const expDate = new Date(hosting.expirationDate);
      expDate.setHours(0, 0, 0, 0);
      
      const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Check if we should send notification
      let shouldNotify = false;
      let notificationType = '';

      if (daysUntilExpiry === 30 && settings.notifyHosting30Days) {
        shouldNotify = true;
        notificationType = '30days';
      } else if (daysUntilExpiry === 7 && settings.notifyHosting7Days) {
        shouldNotify = true;
        notificationType = '7days';
      } else if (daysUntilExpiry === 1 && settings.notifyHosting1Day) {
        shouldNotify = true;
        notificationType = '1day';
      } else if (daysUntilExpiry === 0 && settings.notifyHosting1Day) {
        shouldNotify = true;
        notificationType = 'expiry';
      }

      if (shouldNotify) {
        const logKey = `hosting_${hosting.id}_${notificationType}`;
        
        // Check if already notified today
        if (wasNotifiedToday(notificationLog, logKey)) {
          console.log(`⏭️ Already notified today: ${hosting.name} (${notificationType})`);
          continue;
        }

        // Send email
        const subject = `⚠️ Hosting "${hosting.name}" ${
          daysUntilExpiry === 0 ? 'hết hạn HÔM NAY' : 
          `sắp hết hạn sau ${daysUntilExpiry} ngày`
        }`;
        
        const html = generateHostingExpirationEmail(hosting, daysUntilExpiry);
        const sent = await sendEmail({
          to: settings.email,
          subject,
          html,
        });

        if (sent) {
          sentCount++;
          notificationLog[logKey] = new Date().toISOString().split('T')[0];
          results.push({
            hosting: hosting.name,
            type: notificationType,
            daysUntilExpiry,
            status: 'sent'
          });
          console.log(`✅ Sent email: ${hosting.name} (${daysUntilExpiry} days)`);
        } else {
          results.push({
            hosting: hosting.name,
            type: notificationType,
            daysUntilExpiry,
            status: 'failed'
          });
          console.error(`❌ Failed to send email: ${hosting.name}`);
        }
      }
    }

    // Save notification log
    await saveNotificationLog(notificationLog);

    console.log(`✅ Cron job completed. Sent ${sentCount} emails.`);

    return c.json({
      success: true,
      message: `Checked ${hostings.length} hostings, sent ${sentCount} emails`,
      results,
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    return c.json({ 
      success: false, 
      error: String(error) 
    }, 500);
  }
});

// Manual trigger - Send test email
cron.post('/send-test-email', async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ success: false, error: 'Email is required' }, 400);
    }

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #4DBFAD 0%, #2563B4 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ✅ 1Pixel - Quản lý công việc tập trung
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">
                Email đã được cấu hình thành công!
              </h2>
              <p style="margin: 0; color: #4b5563; font-size: 16px;">
                Hệ thống email notifications đang hoạt động bình thường.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const sent = await sendEmail({
      to: email,
      subject: '✅ Test Email - 1Pixel Email Notifications',
      html,
    });

    if (sent) {
      return c.json({ success: true, message: 'Test email sent successfully' });
    } else {
      return c.json({ success: false, error: 'Failed to send test email' }, 500);
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get notification history
cron.get('/notification-history', async (c) => {
  try {
    const log = await getNotificationLog();
    const history = Object.entries(log).map(([key, date]) => ({
      key,
      date,
    }));

    return c.json({ success: true, history });
  } catch (error) {
    console.error('Error getting notification history:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

export default cron;
