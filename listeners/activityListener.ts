import { PrismaClient } from '@prisma/client';
import { sendNotification } from '../utils/notificationUtils';

const prisma = new PrismaClient();

export async function activityListener(activityType: string, entityId: string, entityType: string, userId: string) {
  // Retrieve all users from the database
  const users = await prisma.user.findMany({
    include: { settings: { include: { notificationPreferences: true } } },
  });

  // Iterate over each user and send notifications based on their preferences
  for (const user of users) {
    if (user.settings && user.settings.notificationPreferences) {
      const { email, push, inApp } = user.settings.notificationPreferences;

      // Check if the user has enabled notifications for the specific activity type
      if (email || push || inApp) {
        // Construct the notification message based on the activity type and entity type
        let message = '';
        switch (activityType) {
          case 'POST_CREATED':
            message = 'A new post has been created.';
            break;
          case 'COMMENT_CREATED':
            message = 'A new comment has been added.';
            break;
          // Add more cases for other activity types
          default:
            break;
        }

        // Send the notification to the user
        await sendNotification(user.id, message, email, push, inApp);
      }
    }
  }
}