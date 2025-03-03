'use client';
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import PageEditor from '@/components/admin/PageEditor';
import Card from '@/components/next-gen/Card';

export default function NewPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <PageEditor />
      </div>
    </AdminLayout>
  );
}
