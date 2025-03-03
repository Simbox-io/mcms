'use client';
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import PageEditor from '@/components/admin/PageEditor';

interface EditPageProps {
  params: {
    slug: string;
  };
}

export default function EditPage({ params }: EditPageProps) {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <PageEditor pageId={params.slug} />
      </div>
    </AdminLayout>
  );
}
