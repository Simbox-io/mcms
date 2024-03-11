// lib/file-storage.ts

import fs from 'fs/promises';
import path from 'path';
import { S3 } from '@aws-sdk/client-s3';
import FTPClient from 'ftp';

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

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucketName = process.env.AWS_BUCKET_NAME!;
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

  constructor() {
    this.ftpClient = new FTPClient();
  }

  async uploadFile(file: File): Promise<string> {
    const fileId = `${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await this.ftpClient.put(buffer, fileId, (error) => {
      if (error) {
        console.error(`Failed to upload file: ${error}`);
      } else {
        console.log('File uploaded successfully');
      }
    });
    return `ftp://${process.env.FTP_HOST}/${fileId}`;
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.ftpClient.delete(fileId, (error) => {
      if (error) {
        console.error(`Failed to delete file: ${error}`);
      } else {
        console.log('File deleted successfully');
      }
    });
  }


  getFileUrl(fileId: string): string {
    return `ftp://${process.env.FTP_HOST}/${fileId}`;
  }
}