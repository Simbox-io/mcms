// lib/file-storage.ts
import fs from 'fs/promises';
import path from 'path';
import { S3 } from '@aws-sdk/client-s3';
import FTPClient from 'ftp';
import { AdminSettings } from '@/lib/prisma';

export interface FileStorageProvider {
  uploadFile(file: File): Promise<string>;
  deleteFile(fileId: string): Promise<void>;
  getFileUrl(fileId: string): string;
}

export class LocalStorageProvider implements FileStorageProvider {
  private readonly storagePath = path.join(process.cwd(), 'public', 'uploads');

  async uploadFile(file: File): Promise<string> {
    const fileId = `${Date.now()}-${file.name}`;
    const filePath = path.join(this.storagePath, fileId);
    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);
    return `/uploads/${fileId}`;
  }

  async deleteFile(fileId: string): Promise<void> {
    const filePath = path.join(this.storagePath, fileId);
    await fs.unlink(filePath);
  }

  getFileUrl(fileId: string): string {
    return `/uploads/${fileId}`;
  }
}

export class S3StorageProvider implements FileStorageProvider {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor(settings: AdminSettings) {
    this.s3 = new S3({
      region: settings.s3Region!,
      credentials: {
        accessKeyId: settings.s3AccessKey!,
        secretAccessKey: settings.s3SecretKey!,
      },
    });
    this.bucketName = settings.s3BucketName!;
  }

  async uploadFile(file: File): Promise<string> {
    const fileId = `${Date.now()}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await this.s3.putObject({
      Bucket: this.bucketName,
      Key: fileId,
      Body: fileBuffer,
    });
    return `https://${this.bucketName}.s3.amazonaws.com/${fileId}`;
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key: fileId,
    });
  }

  getFileUrl(fileId: string): string {
    return `https://${this.bucketName}.s3.amazonaws.com/${fileId}`;
  }
}

export class FTPStorageProvider implements FileStorageProvider {
  private readonly ftpClient: FTPClient;
  private readonly ftpHost: string;
  private readonly ftpDirectory: string;

  constructor(settings: AdminSettings) {
    this.ftpClient = new FTPClient();
    this.ftpHost = settings.ftpHost!;
    this.ftpDirectory = settings.ftpDirectory!;
  }

  async uploadFile(file: File): Promise<string> {
    const fileId = `${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await new Promise<void>((resolve, reject) => {
      this.ftpClient.put(buffer, path.join(this.ftpDirectory, fileId), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    return `ftp://${this.ftpHost}/${this.ftpDirectory}/${fileId}`;
  }

  async deleteFile(fileId: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.ftpClient.delete(path.join(this.ftpDirectory, fileId), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  getFileUrl(fileId: string): string {
    return `ftp://${this.ftpHost}/${this.ftpDirectory}/${fileId}`;
  }
}

export async function getStorageProvider(adminSettings: AdminSettings): Promise<FileStorageProvider> {
  switch (adminSettings.fileStorageProvider) {
    case 's3':
      return new S3StorageProvider(adminSettings);
    case 'ftp':
      return new FTPStorageProvider(adminSettings);
    case 'local':
    default:
      return new LocalStorageProvider();
  }
}