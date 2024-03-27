// lib/email.ts

import nodemailer from 'nodemailer';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import prisma from '@/lib/prisma';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface EmailConfig {
  provider: string;
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  ses?: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  from: string;
}

let emailConfig: EmailConfig;

export function setEmailConfig(config: EmailConfig) {
  emailConfig = config;
}

export async function sendEmail(options: EmailOptions) {
  if (!emailConfig) {
    throw new Error('Email configuration not set');
  }

  const { provider, from } = emailConfig;
  const { to, subject, text, html } = options;

  if (provider === 'smtp') {
    const { host, port, secure, auth } = emailConfig.smtp!;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
  } else if (provider === 'ses') {
    const { region, accessKeyId, secretAccessKey } = emailConfig.ses!;

    const sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const sendEmailCommand = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: text || '',
          },
          Html: {
            Data: html || '',
          },
        },
      },
    });

    await sesClient.send(sendEmailCommand);
  }

  console.log('Email sent successfully');
}

export async function sendEmailDigest(user: { id: string; email: string; notifications: { message: string; createdAt: string }[] }) {
  const { email, notifications } = user;

  if (notifications.length === 0) {
    return;
  }

  const adminSettings = await prisma.adminSettings.findUnique({
    where: { id: 1 },
  });

  const subject = adminSettings?.emailDigestSubject || 'MCMS - Notification Digest';
  const signature = adminSettings?.emailSignature || 'Best regards,\nMCMS Team';

  const text = `Hello,\n\nHere is your notification digest:\n\n${notifications
    .map((notification) => `- ${notification.message} (${new Date(notification.createdAt).toLocaleString()})`)
    .join('\n')}\n\n${signature}`;

  const html = `
    <div>
      <p>Hello,</p>
      <p>Here is your notification digest:</p>
      <ul>
        ${notifications
          .map((notification) => `<li>${notification.message} (${new Date(notification.createdAt).toLocaleString()})</li>`)
          .join('')}
      </ul>
      <p>${signature.replace(/\n/g, '<br>')}</p>
    </div>
  `;

  await sendEmail({ to: email, subject, text, html });
}