import { sendEmail, setEmailConfig } from '../lib/email';
import prisma from '@/lib/prisma';

export async function sendNotification(userId: string, message: string, link: string, email: boolean, push: boolean, inApp: boolean) {
  // Implement the logic to send notifications based on the user's preferences
  if (email) {
    // Retrieve the user's email address from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (user && user.email) {

      // Retrieve the email configuration from the database
      const config = await prisma.adminSettings.findFirst();
      if(!config) {
        return;
      }
      const emailSet = await setEmailConfig({
        provider: config.emailProvider || 'smtp',
        smtp: {
          host: config.smtpHost || '',
          port: config.smtpPort || 587,
          secure: config.smtpSecure || false,
          auth: {
            user: config.smtpAuthUser || '',
            pass: config.smtpAuthPass || '',
          },
        },
        ses: {
          region: config.sesRegion || '',
          accessKeyId: config.sesAccessKey || '',
          secretAccessKey: config.sesSecretAccessKey || '',
        },
        from: config.emailFrom || '',
      });
  
      console.log('Email set:', emailSet);
      // Send email notification using the existing sendEmail function
      await sendEmail({
        to: user.email,
        subject: 'New Notification',
        text: message,
        html: `<p>${message}</p>`,
      });
    }
  }

  if (push) {
    // Send push notification
    // ...
  }

  if (inApp) {
    // Create an in-app notification record in the database
    await prisma.notification.create({
      data: {
        userId,
        message,
        link,
      },
    });
  }
}