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
  getFileContent(fileId: string): Promise<string>;
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

  async getFileContent(fileId: string): Promise<string> {
    const filePath = path.join(this.storagePath, fileId);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return fileContent;
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

  async getFileContent(fileId: string): Promise<string> {
    const response = await this.s3.getObject({
      Bucket: this.bucketName,
      Key: fileId.replace(`https://${this.bucketName}.s3.amazonaws.com/`, '')
    });
    const fileContent = await response.Body?.transformToString() || '';
    return fileContent;
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

  async getFileContent(fileId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.ftpClient.get(path.join(this.ftpDirectory, fileId), (error, stream) => {
        if (error) {
          reject(error);
        } else {
          let fileContent = '';
          stream.on('data', (chunk) => {
            fileContent += chunk.toString();
          });
          stream.on('end', () => {
            resolve(fileContent);
          });
        }
      });
    });
  }
}

export async function getStorageProvider(adminSettings: AdminSettings): Promise<FileStorageProvider> {
  switch (adminSettings.fileStorageProvider) {
    case 's3':
      return new S3StorageProvider(adminSettings);
    case 'ftp':
      return new FTPStorageProvider(adminSettings);
    case 'local':
      return new LocalStorageProvider();
    default:
      return new LocalStorageProvider();
  }
}