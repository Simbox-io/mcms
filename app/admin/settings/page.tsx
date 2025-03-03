// app/admin/settings/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import EmptyState from '../../../components/EmptyState';
import Select from '../../../components/next-gen/Select';
import Toggle from '../../../components/Toggle';
import { User } from '@/lib/prisma';
import { instance } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface AdminSettings {
  siteTitle: string;
  siteDescription: string;
  logo: string;
  accentColor: string;
  fileStorageProvider: string;
  s3AccessKey: string;
  s3SecretKey: string;
  s3BucketName: string;
  s3Region: string;
  ftpHost: string;
  ftpUser: string;
  ftpPassword: string;
  ftpDirectory: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  requireEmailVerification: boolean;
  requireAccountApproval: boolean;
  enableUserRegistration: boolean;
  requireLoginToDownload: boolean;
  autoDeleteFiles: boolean;
  fileExpirationPeriod: number;
  enableVersioning: boolean;
  emailProvider: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpAuthUser: string;
  smtpAuthPass: string;
  sesRegion: string;
  sesAccessKey: string;
  sesSecretAccessKey: string;
  emailFrom: string;
  footerText: string;
  copyrightText: string;
}

const defaultSettings: AdminSettings = {
  siteTitle: 'My Site',
  siteDescription: 'A default site description',
  logo: '/path/to/default/logo.png',
  accentColor: '#000000',
  fileStorageProvider: 'local',
  s3AccessKey: '',
  s3SecretKey: '',
  s3BucketName: '',
  s3Region: '',
  ftpHost: '',
  ftpUser: '',
  ftpPassword: '',
  ftpDirectory: '',
  maxFileSize: 10,
  allowedFileTypes: ['.jpg', '.png', '.pdf'],
  requireEmailVerification: false,
  requireAccountApproval: false,
  enableUserRegistration: true,
  requireLoginToDownload: false,
  autoDeleteFiles: false,
  fileExpirationPeriod: 30,
  enableVersioning: false,
  emailProvider: 'smtp',
  smtpHost: '',
  smtpPort: 587,
  smtpSecure: false,
  smtpAuthUser: '',
  smtpAuthPass: '',
  sesRegion: '',
  sesAccessKey: '',
  sesSecretAccessKey: '',
  emailFrom: '',
  footerText: ' 2025 My Organization',
  copyrightText: 'All rights reserved',
};

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    siteTitle: '',
    siteDescription: '',
    logo: '',
    accentColor: '',
    fileStorageProvider: 'local',
    s3AccessKey: '',
    s3SecretKey: '',
    s3BucketName: '',
    s3Region: '',
    ftpHost: '',
    ftpUser: '',
    ftpPassword: '',
    ftpDirectory: '',
    maxFileSize: 0,
    allowedFileTypes: [],
    requireEmailVerification: false,
    requireAccountApproval: false,
    enableUserRegistration: true,
    requireLoginToDownload: false,
    autoDeleteFiles: false,
    fileExpirationPeriod: 30,
    enableVersioning: false,
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpAuthUser: '',
    smtpAuthPass: '',
    sesRegion: '',
    sesAccessKey: '',
    sesSecretAccessKey: '',
    emailFrom: '',
    footerText: '',
    copyrightText: '',
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await instance.get('/api/admin/settings');
        if (response.data) {
          setSettings(response.data);
          if (response.data.logo) {
            setLogoPreview(response.data.logo);
          }
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching admin settings:', error);
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleToggle = (name: keyof AdminSettings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: !prevSettings[name],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSettings({ ...settings, logo: base64String });
        setLogoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await instance.put('/api/admin/settings', settings);
      if (response.status !== 200) {
        console.error('Error updating admin settings:', response.statusText);
        toast({
          title: 'Error',
          description: 'Failed to update settings',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Success',
          description: 'Settings updated successfully',
          variant: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating admin settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive'
      });
    }
    setIsSaving(false);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
        Admin Settings
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Site Title"
                type="text"
                id="siteTitle"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleChange}
                required
              />
              <Input
                label="Site Description"
                type="text"
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                required
              />
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Site Logo
                </label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {logoPreview ? (
                      <div className="w-32 h-32 border rounded-md overflow-hidden">
                        <img 
                          src={logoPreview} 
                          alt="Site Logo" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 border rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <span className="text-gray-400">No logo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="file"
                      id="logoUpload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => document.getElementById('logoUpload')?.click()}
                    >
                      Upload Logo
                    </Button>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Recommended size: 200x50 pixels. PNG or SVG format preferred.
                    </p>
                    {logoPreview && (
                      <Button
                        variant="danger"
                        className="mt-2"
                        onClick={() => {
                          setSettings({ ...settings, logo: '' });
                          setLogoPreview('');
                        }}
                      >
                        Remove Logo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <Input
                label="Accent Color"
                type="color"
                id="accentColor"
                name="accentColor"
                value={settings.accentColor}
                onChange={handleChange}
                required
              />
            </div>
          </Card>

          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">File Storage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                value={settings.fileStorageProvider}
                onChange={(value) => handleSelectChange('fileStorageProvider', value)}
                options={[
                  { value: 'local', label: 'Local' },
                  { value: 's3', label: 'Amazon S3' },
                  { value: 'ftp', label: 'FTP' },
                ]}
              />
              {settings.fileStorageProvider === 's3' && (
                <>
                  <Input
                    label="S3 Access Key"
                    type="text"
                    id="s3AccessKey"
                    name="s3AccessKey"
                    value={settings.s3AccessKey}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="S3 Secret Key"
                    type="password"
                    id="s3SecretKey"
                    name="s3SecretKey"
                    value={settings.s3SecretKey}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="S3 Bucket Name"
                    type="text"
                    id="s3BucketName"
                    name="s3BucketName"
                    value={settings.s3BucketName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="S3 Region"
                    type="text"
                    id="s3Region"
                    name="s3Region"
                    value={settings.s3Region}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              {settings.fileStorageProvider === 'ftp' && (
                <>
                  <Input
                    label="FTP Host"
                    type="text"
                    id="ftpHost"
                    name="ftpHost"
                    value={settings.ftpHost}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="FTP User"
                    type="text"
                    id="ftpUser"
                    name="ftpUser"
                    value={settings.ftpUser}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="FTP Password"
                    type="password"
                    id="ftpPassword"
                    name="ftpPassword"
                    value={settings.ftpPassword}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="FTP Directory"
                    type="text"
                    id="ftpDirectory"
                    name="ftpDirectory"
                    value={settings.ftpDirectory}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
            </div>
          </Card>

          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                value={settings.emailProvider}
                onChange={(value) => handleSelectChange('emailProvider', value)}
                options={[
                  { value: 'smtp', label: 'SMTP' },
                  { value: 'ses', label: 'Amazon SES' },
                ]}
              />
              {settings.emailProvider === 'smtp' && (
                <>
                  <Input
                    label="SMTP Host"
                    type="text"
                    id="smtpHost"
                    name="smtpHost"
                    value={settings.smtpHost}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="SMTP Port"
                    type="number"
                    id="smtpPort"
                    name="smtpPort"
                    value={settings.smtpPort.toString()}
                    onChange={handleChange}
                    required
                  />
                  <Toggle
                    label="SMTP Secure"
                    checked={settings.smtpSecure}
                    onChange={() => handleToggle('smtpSecure')}
                  />
                  <Input
                    label="SMTP Auth User"
                    type="text"
                    id="smtpAuthUser"
                    name="smtpAuthUser"
                    value={settings.smtpAuthUser}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="SMTP Auth Password"
                    type="password"
                    id="smtpAuthPass"
                    name="smtpAuthPass"
                    value={settings.smtpAuthPass}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              {settings.emailProvider !== 'smtp' && (
                <>
                  <Input
                    label="SES Region"
                    type="text"
                    id="sesRegion"
                    name="sesRegion"
                    value={settings.sesRegion}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="SES Access Key ID"
                    type="text"
                    id="sesAccessKey"
                    name="sesAccessKey"
                    value={settings.sesAccessKey}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="SES Secret Access Key"
                    type="password"
                    id="sesSecretAccessKey"
                    name="sesSecretAccessKey"
                    value={settings.sesSecretAccessKey}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              <Input
                label="Email From"
                type="email"
                id="emailFrom"
                name="emailFrom"
                value={settings.emailFrom}
                onChange={handleChange}
                required
              />
            </div>
          </Card>

          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">File Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Max File Size (MB)"
                type="number"
                id="maxFileSize"
                name="maxFileSize"
                value={settings.maxFileSize.toString()}
                onChange={handleChange}
                required
              />
              <Input
                label="Allowed File Types (comma-separated)"
                type="text"
                id="allowedFileTypes"
                name="allowedFileTypes"
                value={settings.allowedFileTypes.join(',')}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowedFileTypes: e.target.value.split(','),
                  })
                }
                required
              />
              <div>
                <Toggle
                  label="Auto Delete Files"
                  checked={settings.autoDeleteFiles}
                  onChange={() => handleToggle('autoDeleteFiles')}
                />
                {settings.autoDeleteFiles && (
                  <Input
                    label="File Expiration Period (days)"
                    type="number"
                    id="fileExpirationPeriod"
                    name="fileExpirationPeriod"
                    value={settings.fileExpirationPeriod.toString()}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
              <Toggle
                label="Enable Versioning"
                checked={settings.enableVersioning}
                onChange={() => handleToggle('enableVersioning')}
              />
            </div>
          </Card>

          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Footer Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Footer Text"
                type="text"
                id="footerText"
                name="footerText"
                value={settings.footerText}
                onChange={handleChange}
                required
              />
              <Input
                label="Copyright Text"
                type="text"
                id="copyrightText"
                name="copyrightText"
                value={settings.copyrightText}
                onChange={handleChange}
                required
              />
            </div>
          </Card>

          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">User Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Toggle
                label="Require Email Verification"
                checked={settings.requireEmailVerification}
                onChange={() => handleToggle('requireEmailVerification')}
              />
              <Toggle
                label="Require Account Approval"
                checked={settings.requireAccountApproval}
                onChange={() => handleToggle('requireAccountApproval')}
              />
              <Toggle
                label="Enable User Registration"
                checked={settings.enableUserRegistration}
                onChange={() => handleToggle('enableUserRegistration')}
              />
              <Toggle
                label="Require Login to Download"
                checked={settings.requireLoginToDownload}
                onChange={() => handleToggle('requireLoginToDownload')}
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminSettingsPage;