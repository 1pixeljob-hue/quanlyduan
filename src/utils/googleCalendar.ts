import { Hosting } from '../App';
import { Project } from '../components/ProjectList';

// Google Calendar API configuration
// HARDCODED for production - Figma.site doesn't support .env files
const GOOGLE_CLIENT_ID = '282764469518-3ccj2uov2pa6k9s9es201r9jl8hpdem7.apps.googleusercontent.com';
const GOOGLE_API_KEY = ''; // Optional - không cần thiết cho OAuth flow
const GOOGLE_CLIENT_SECRET = ''; // KHÔNG dùng ở frontend
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

// Initialize Google API
export const initGoogleAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Client ID is available
    if (!GOOGLE_CLIENT_ID) {
      reject(new Error('Google Client ID is not configured'));
      return;
    }

    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.defer = true;
    script1.onerror = () => reject(new Error('Failed to load Google API script'));
    script1.onload = () => {
      (window as any).gapi.load('client', async () => {
        try {
          const initConfig: any = {
            discoveryDocs: [DISCOVERY_DOC],
          };
          
          // Only add API key if available
          if (GOOGLE_API_KEY) {
            initConfig.apiKey = GOOGLE_API_KEY;
          }
          
          await (window as any).gapi.client.init(initConfig);
          gapiInited = true;
          maybeEnableButtons(resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    };
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    script2.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
    script2.onload = () => {
      tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
      });
      gisInited = true;
      maybeEnableButtons(resolve, reject);
    };
    document.body.appendChild(script2);
  });
};

function maybeEnableButtons(resolve: () => void, reject: (reason: any) => void) {
  if (gapiInited && gisInited) {
    resolve();
  }
}

// Check if user is authorized
export const isAuthorized = (): boolean => {
  const token = localStorage.getItem('google_calendar_token');
  return !!token;
};

// Authorize Google Calendar
export const authorizeGoogleCalendar = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if tokenClient is initialized
    if (!tokenClient) {
      reject(new Error('Token client not initialized. Please refresh the page.'));
      return;
    }

    tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        reject(new Error(resp.error_description || resp.error));
        return;
      }
      
      // Save token to localStorage
      localStorage.setItem('google_calendar_token', resp.access_token);
      localStorage.setItem('google_calendar_token_expiry', String(Date.now() + (resp.expires_in * 1000)));
      
      // Set token to gapi client
      (window as any).gapi.client.setToken({
        access_token: resp.access_token
      });
      
      resolve();
    };

    // Check if we already have a valid token
    const savedToken = localStorage.getItem('google_calendar_token');
    const tokenExpiry = localStorage.getItem('google_calendar_token_expiry');
    
    if (savedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      // Token is still valid, use it
      (window as any).gapi.client.setToken({
        access_token: savedToken
      });
      resolve();
    } else {
      // Need new token
      try {
        if ((window as any).gapi.client.getToken() === null) {
          tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          tokenClient.requestAccessToken({ prompt: '' });
        }
      } catch (err) {
        reject(err);
      }
    }
  });
};

// Sign out from Google Calendar
export const signOutGoogleCalendar = () => {
  const token = (window as any).gapi.client.getToken();
  if (token !== null) {
    (window as any).google.accounts.oauth2.revoke(token.access_token);
    (window as any).gapi.client.setToken('');
  }
  localStorage.removeItem('google_calendar_token');
  localStorage.removeItem('google_calendar_token_expiry');
  localStorage.removeItem('google_calendar_ids');
};

// Set access token
const setAccessToken = () => {
  const token = localStorage.getItem('google_calendar_token');
  if (token) {
    (window as any).gapi.client.setToken({ access_token: token });
  }
};

// Create calendar event for hosting
export const createHostingEvent = async (hosting: Hosting): Promise<string | null> => {
  try {
    setAccessToken();

    const expDate = new Date(hosting.expirationDate);
    const reminderDates = [
      { days: 7, title: '7 ngày trước hết hạn' },
      { days: 1, title: '1 ngày trước hết hạn' },
      { days: 0, title: 'Ngày hết hạn' }
    ];

    const eventIds: string[] = [];

    for (const reminder of reminderDates) {
      const eventDate = new Date(expDate);
      eventDate.setDate(eventDate.getDate() - reminder.days);

      const event = {
        summary: `🌐 ${hosting.name} - ${reminder.title}`,
        description: `
Hosting: ${hosting.name}
Domain: ${hosting.domain}
Nhà cung cấp: ${hosting.provider}
Ngày hết hạn: ${new Date(hosting.expirationDate).toLocaleDateString('vi-VN')}
Giá: ${hosting.price.toLocaleString('vi-VN')} VNĐ

${hosting.notes || 'Không có ghi chú'}

⚠️ Nhắc nhở: ${reminder.title}
        `.trim(),
        start: {
          date: eventDate.toISOString().split('T')[0],
        },
        end: {
          date: eventDate.toISOString().split('T')[0],
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 60 },
          ],
        },
        colorId: reminder.days === 0 ? '11' : (reminder.days === 1 ? '6' : '9'), // Red for expiry, Orange for 1 day, Blue for 7 days
      };

      const response = await (window as any).gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      eventIds.push(response.result.id);
    }

    // Store event IDs
    const calendarIds = JSON.parse(localStorage.getItem('google_calendar_ids') || '{}');
    calendarIds[`hosting_${hosting.id}`] = eventIds;
    localStorage.setItem('google_calendar_ids', JSON.stringify(calendarIds));

    return eventIds[0];
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
};

// Update calendar event for hosting
export const updateHostingEvent = async (hosting: Hosting): Promise<void> => {
  try {
    // Delete old events
    await deleteHostingEvent(hosting.id);
    
    // Create new events
    await createHostingEvent(hosting);
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
  }
};

// Delete calendar event for hosting
export const deleteHostingEvent = async (hostingId: string): Promise<void> => {
  try {
    setAccessToken();
    
    const calendarIds = JSON.parse(localStorage.getItem('google_calendar_ids') || '{}');
    const eventIds = calendarIds[`hosting_${hostingId}`];

    if (eventIds && Array.isArray(eventIds)) {
      for (const eventId of eventIds) {
        try {
          await (window as any).gapi.client.calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
          });
        } catch (err) {
          console.error('Error deleting event:', eventId, err);
        }
      }
      
      delete calendarIds[`hosting_${hostingId}`];
      localStorage.setItem('google_calendar_ids', JSON.stringify(calendarIds));
    }
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
  }
};

// Create calendar event for project
export const createProjectEvent = async (project: Project): Promise<string | null> => {
  try {
    setAccessToken();

    const event = {
      summary: `📁 Project: ${project.name}`,
      description: `
Khách hàng: ${project.customer}
Điện thoại: ${project.customerPhone}
Trạng thái: ${getProjectStatusText(project.status)}
Giá: ${project.price.toLocaleString('vi-VN')} VNĐ

Mô tả:
${project.description}

${project.adminUrl ? `Admin URL: ${project.adminUrl}` : ''}
      `.trim(),
      start: {
        date: new Date(project.createdAt).toISOString().split('T')[0],
      },
      end: {
        date: new Date(project.createdAt).toISOString().split('T')[0],
      },
      colorId: getProjectColorId(project.status),
    };

    const response = await (window as any).gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    const calendarIds = JSON.parse(localStorage.getItem('google_calendar_ids') || '{}');
    calendarIds[`project_${project.id}`] = [response.result.id];
    localStorage.setItem('google_calendar_ids', JSON.stringify(calendarIds));

    return response.result.id;
  } catch (error) {
    console.error('Error creating project calendar event:', error);
    return null;
  }
};

// Update calendar event for project
export const updateProjectEvent = async (project: Project): Promise<void> => {
  try {
    await deleteProjectEvent(project.id);
    await createProjectEvent(project);
  } catch (error) {
    console.error('Error updating project calendar event:', error);
  }
};

// Delete calendar event for project
export const deleteProjectEvent = async (projectId: string): Promise<void> => {
  try {
    setAccessToken();
    
    const calendarIds = JSON.parse(localStorage.getItem('google_calendar_ids') || '{}');
    const eventIds = calendarIds[`project_${projectId}`];

    if (eventIds && Array.isArray(eventIds)) {
      for (const eventId of eventIds) {
        try {
          await (window as any).gapi.client.calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
          });
        } catch (err) {
          console.error('Error deleting event:', eventId, err);
        }
      }
      
      delete calendarIds[`project_${projectId}`];
      localStorage.setItem('google_calendar_ids', JSON.stringify(calendarIds));
    }
  } catch (error) {
    console.error('Error deleting project calendar event:', error);
  }
};

// Helper functions
function getProjectStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'planning': 'Lên Kế Hoạch',
    'in-progress': 'Đang Thực Hiện',
    'pending-acceptance': 'Chờ Nghiệm Thu',
    'completed': 'Hoàn Thành',
    'on-hold': 'Tạm Dừng'
  };
  return statusMap[status] || status;
}

function getProjectColorId(status: string): string {
  const colorMap: Record<string, string> = {
    'planning': '9',      // Blue
    'in-progress': '5',   // Yellow
    'pending-acceptance': '6', // Orange
    'completed': '10',    // Green
    'on-hold': '8'        // Gray
  };
  return colorMap[status] || '9';
}

// Sync all hostings to Google Calendar
export const syncAllHostingsToCalendar = async (hostings: Hosting[]): Promise<number> => {
  let count = 0;
  for (const hosting of hostings) {
    const result = await createHostingEvent(hosting);
    if (result) count++;
  }
  return count;
};

// Sync all projects to Google Calendar
export const syncAllProjectsToCalendar = async (projects: Project[]): Promise<number> => {
  let count = 0;
  for (const project of projects) {
    const result = await createProjectEvent(project);
    if (result) count++;
  }
  return count;
};