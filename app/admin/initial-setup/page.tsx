'use client';

import React, { useState } from 'react';
import Input from '@/components/base/Input';
import Select from '@/components/base/Select';
import FileUpload from '@/components/base/FileUpload';
import Checkbox from '@/components/base/Checkbox';
import TagInput from '@/components/base/TagInput';
import Button from '@/components/base/Button';
import Card from '@/components/base/Card';
import Progress from '@/components/base/Progress';
import Feedback from '@/components/base/Feedback';

const AdminSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [accentColor, setAccentColor] = useState('#4F46E5');
  const [fileStorageProvider, setFileStorageProvider] = useState('local');
  const [s3AccessKey, setS3AccessKey] = useState('');
  const [s3SecretKey, setS3SecretKey] = useState('');
  const [s3BucketName, setS3BucketName] = useState('');
  const [s3Region, setS3Region] = useState('');
  const [ftpHost, setFtpHost] = useState('');
  const [ftpUser, setFtpUser] = useState('');
  const [ftpPassword, setFtpPassword] = useState('');
  const [ftpDirectory, setFtpDirectory] = useState('');
  const [maxFileSize, setMaxFileSize] = useState(10);
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>([]);
  const [requireEmailVerification, setRequireEmailVerification] = useState(false);
  const [requireAccountApproval, setRequireAccountApproval] = useState(false);
  const [enableUserRegistration, setEnableUserRegistration] = useState(true);
  const [requireLoginToDownload, setRequireLoginToDownload] = useState(false);
  const [autoDeleteFiles, setAutoDeleteFiles] = useState(false);
  const [fileExpirationPeriod, setFileExpirationPeriod] = useState(30);
  const [enableVersioning, setEnableVersioning] = useState(false);
  const [emailProvider, setEmailProvider] = useState('smtp');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [smtpAuthUser, setSmtpAuthUser] = useState('');
  const [smtpAuthPass, setSmtpAuthPass] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Form submitted');
    setToastOpen(true);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card
          effects={false}
            className="p-6 mb-4 mx-auto max-w-lg"
            content={
              <>
                <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
                <Input
                  type="text"
                  name="siteTitle"
                  id="siteTitle"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  label="Site Title"
                  placeholder="Enter your site title"
                  fullWidth
                  required
                />
                <Input
                  type="text"
                  name="siteDescription"
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  label="Site Description"
                  placeholder="Enter your site description"
                  fullWidth
                  required
                />
                <div className="mb-4">
                  <label htmlFor="logo" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                    Logo
                  </label>
                  <FileUpload
                    onFileSelect={(files) => setLogo(files ? files[0] : null)}
                    onUpload={() => {}}
                    accept="image/*"
                    multiple={false}
                    label="Upload Logo"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="accentColor" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    id="accentColor"
                    name="accentColor"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            }
            footer={
              <div className="flex justify-end">
                <Button onClick={handleNext}>Next</Button>
              </div>
            }
          />
        );
      case 2:
        return (
          <Card
          effects={false}
            className="p-6 mb-4 mx-auto max-w-lg"
            content={
              <>
                <h2 className="text-2xl font-semibold mb-4">File Storage Settings</h2>
                <Select
                  options={[
                    { value: 'local', label: 'Local' },
                    { value: 's3', label: 'Amazon S3' },
                    { value: 'ftp', label: 'FTP' },
                  ]}
                  value={fileStorageProvider}
                  onChange={(value) => setFileStorageProvider(value)}
                  label="File Storage Provider"
                  fullWidth
                  required
                />
                {fileStorageProvider === 's3' && (
                  <>
                    <Input
                      type="text"
                      name="s3AccessKey"
                      id="s3AccessKey"
                      value={s3AccessKey}
                      onChange={(e) => setS3AccessKey(e.target.value)}
                      label="S3 Access Key"
                      placeholder="Enter your S3 access key"
                      fullWidth
                      required
                    />
                    <Input
                      type="text"
                      name="s3SecretKey"
                      id="s3SecretKey"
                      value={s3SecretKey}
                      onChange={(e) => setS3SecretKey(e.target.value)}
                      label="S3 Secret Key"
                      placeholder="Enter your S3 secret key"
                      fullWidth
                      required
                    />
                    <Input
                      type="text"
                      name="s3BucketName"
                      id="s3BucketName"
                      value={s3BucketName}
                      onChange={(e) => setS3BucketName(e.target.value)}
                      label="S3 Bucket Name"
                      placeholder="Enter your S3 bucket name"
                      fullWidth
                      required
                    />
                    <Input
                      type="text"
                      name="s3Region"
                      id="s3Region"
                      value={s3Region}
                      onChange={(e) => setS3Region(e.target.value)}
                      label="S3 Region"
                      placeholder="Enter your S3 region"
                      fullWidth
                      required
                    />
                  </>
                )}
                {fileStorageProvider === 'ftp' && (
                  <>
                    <Input
                      type="text"
                      name="ftpHost"
                      id="ftpHost"
                      value={ftpHost}
                      onChange={(e) => setFtpHost(e.target.value)}
                      label="FTP Host"
                      placeholder="Enter your FTP host"
                      fullWidth
                      required
                    />
                    <Input
                      type="text"
                      name="ftpUser"
                      id="ftpUser"
                      value={ftpUser}
                      onChange={(e) => setFtpUser(e.target.value)}
                      label="FTP User"
                      placeholder="Enter your FTP username"
                      fullWidth
                      required
                    />
                    <Input
                      type="password"
                      name="ftpPassword"
                      id="ftpPassword"
                      value={ftpPassword}
                      onChange={(e) => setFtpPassword(e.target.value)}
                      label="FTP Password"
                      placeholder="Enter your FTP password"
                      fullWidth
                      required
                    />
                    <Input
                      type="text"
                      name="ftpDirectory"
                      id="ftpDirectory"
                      value={ftpDirectory}
                      onChange={(e) => setFtpDirectory(e.target.value)}
                      label="FTP Directory"
                      placeholder="Enter your FTP directory"
                      fullWidth
                      required
                    />
                  </>
                )}
                <Input
                  type="number"
                  name="maxFileSize"
                  id="maxFileSize"
                  value={String(maxFileSize)}
                  onChange={(e) => setMaxFileSize(Number(e.target.value))}
                  label="Max File Size (MB)"
                  fullWidth
                  required
                />
                <TagInput
                  tags={allowedFileTypes}
                  onChange={setAllowedFileTypes}
                  placeholder="Enter allowed file types"
                  className="mb-4"
                />
              </>
            }
            footer={
              <div className="flex justify-between">
                <Button onClick={handlePrev} variant="secondary">
                  Previous
                </Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            }
          />
        );
      case 3:
        return (
          <Card
          effects={false}
            className="p-6 mb-4 mx-auto max-w-lg"
            content={
              <>
                <h2 className="text-2xl font-semibold mb-4">User Settings</h2>
                <Checkbox
                  label="Require Email Verification"
                  checked={requireEmailVerification}
                  onChange={setRequireEmailVerification}
                  className="mb-4"
                />
                <Checkbox
                  label="Require Account Approval"
                  checked={requireAccountApproval}
                  onChange={setRequireAccountApproval}
                  className="mb-4"
                />
                <Checkbox
                  label="Enable User Registration"
                  checked={enableUserRegistration}
                  onChange={setEnableUserRegistration}
                  className="mb-4"
                />
                <Checkbox
                  label="Require Login to Download"
                  checked={requireLoginToDownload}
                  onChange={setRequireLoginToDownload}
                  className="mb-4"
                />
              </>
            }
            footer={
              <div className="flex justify-between">
                <Button onClick={handlePrev} variant="secondary">
                  Previous
                </Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            }
          />
        );
      case 4:
        return (
          <Card
          effects={false}
            className="p-6 mb-4 mx-auto max-w-lg"
            content={
              <>
                <h2 className="text-2xl font-semibold mb-4">File Management Settings</h2>
                <Checkbox
                  label="Auto Delete Files"
                  checked={autoDeleteFiles}
                  onChange={setAutoDeleteFiles}
                  className="mb-4"
                />
                <Input
                  type="number"
                  name="fileExpirationPeriod"
                  id="fileExpirationPeriod"
                  value={String(fileExpirationPeriod)}
                  onChange={(e) => setFileExpirationPeriod(Number(e.target.value))}
                  label="File Expiration Period (Days)"
                  fullWidth
                  required
                  disabled={!autoDeleteFiles}
                />
                <Checkbox
                  label="Enable Versioning"
                  checked={enableVersioning}
                  onChange={setEnableVersioning}
                  className="mb-4"
                />
              </>
            }
            footer={
              <div className="flex justify-between">
                <Button onClick={handlePrev} variant="secondary">
                  Previous
                </Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            }
          />
        );
      case 5:
        return (
          <Card
          effects={false}
            className="p-6 mb-4 mx-auto max-w-lg"
            content={
              <>
                <h2 className="text-2xl font-semibold mb-4">Email Settings</h2>
                <Select
                  options={[
                    { value: 'smtp', label: 'SMTP' },
                    { value: 'ses', label: 'Amazon SES' },
                  ]}
                  value={emailProvider}
                  onChange={(value) => setEmailProvider(value)}
                  label="Email Provider"
                  fullWidth
                  required
                />
                {emailProvider === 'smtp' && (
                  <>
                    <Input
                      type="text"
                      name="smtpHost"
                      id="smtpHost"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      label="SMTP Host"
                      placeholder="Enter your SMTP host"
                      fullWidth
                      required
                    />
                    <Input
                      type="number"
                      name="smtpPort"
                      id="smtpPort"
                      value={String(smtpPort)}
                      onChange={(e) => setSmtpPort(Number(e.target.value))}
                      label="SMTP Port"
                      fullWidth
                      required
                    />
                    <Checkbox
                      label="Use SSL/TLS"
                      checked={smtpSecure}
                      onChange={setSmtpSecure}
                      className="mb-4"
                    />
                    <Input
                      type="text"
                      name="smtpAuthUser"
                      id="smtpAuthUser"
                      value={smtpAuthUser}
                      onChange={(e) => setSmtpAuthUser(e.target.value)}
                      label="SMTP Username"
                      placeholder="Enter your SMTP username"
                      fullWidth
                      required
                    />
                    <Input
                      type="password"
                      name="smtpAuthPass"
                      id="smtpAuthPass"
                      value={smtpAuthPass}
                      onChange={(e) => setSmtpAuthPass(e.target.value)}
                      label="SMTP Password"
                      placeholder="Enter your SMTP password"
                      fullWidth
                      required
                    />
                  </>
                )}
                <Input
                  type="email"
                  name="emailFrom"
                  id="emailFrom"
                  value={emailFrom}
                  onChange={(e) => setEmailFrom(e.target.value)}
                  label="Email From Address"
                  placeholder="Enter the from email address"
                  fullWidth
                  required
                />
              </>
            }
            footer={
              <div className="flex justify-between">
                <Button onClick={handlePrev} variant="secondary">
                  Previous
                </Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Setup</h1>
      <Progress value={(step / 5) * 100} className="mb-8" />
      {renderStep()}
      <Feedback
        isOpen={toastOpen}
        onClose={handleCloseToast}
        message="Setup completed successfully!"
        type="toast"
        variant="success"
        duration={3000}
        position="top-right"
      />
    </div>
  );
};

export default AdminSetup;