'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiSave, FiEye, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Input from '@/components/next-gen/Input';
import Textarea from '@/components/next-gen/Textarea';
import Button from '@/components/next-gen/Button';
import Card from '@/components/next-gen/Card';
import Spinner from '@/components/base/Spinner';
import SectionEditor from './SectionEditor';
import ContentTypeSelector from './ContentTypeSelector';
import { toast } from 'react-hot-toast';

interface PageEditorProps {
  pageId?: string;
}

const PageEditor: React.FC<PageEditorProps> = ({ pageId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState<any>({
    title: '',
    slug: '',
    description: '',
    isPublished: false,
    isHomePage: false,
    layout: 'default',
    metaTitle: '',
    metaDescription: '',
    featuredImage: '',
    sections: [],
  });
  
  // Fetch page data if editing an existing page
  useEffect(() => {
    if (pageId) {
      const fetchPage = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/admin/pages/${pageId}`);
          setPage(response.data);
        } catch (error) {
          console.error('Error fetching page:', error);
          toast.error('Failed to load page data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPage();
    }
  }, [pageId]);
  
  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setPage((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Generate slug from title
  const generateSlug = () => {
    const slug = page.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    handleChange('slug', slug);
  };
  
  // Handle section changes
  const handleSectionChange = (index: number, updatedSection: any) => {
    const updatedSections = [...page.sections];
    updatedSections[index] = updatedSection;
    handleChange('sections', updatedSections);
  };
  
  // Add a new section
  const handleAddSection = (type: string) => {
    const newSection = {
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      type,
      content: {},
      order: page.sections.length,
      isEnabled: true,
      settings: {},
    };
    
    handleChange('sections', [...page.sections, newSection]);
  };
  
  // Remove a section
  const handleRemoveSection = (index: number) => {
    const updatedSections = [...page.sections];
    updatedSections.splice(index, 1);
    
    // Update order for remaining sections
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      order: idx,
    }));
    
    handleChange('sections', reorderedSections);
  };
  
  // Move a section up or down
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === page.sections.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSections = [...page.sections];
    
    // Swap sections
    [updatedSections[index], updatedSections[newIndex]] = [
      updatedSections[newIndex],
      updatedSections[index],
    ];
    
    // Update order for all sections
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      order: idx,
    }));
    
    handleChange('sections', reorderedSections);
  };
  
  // Save the page
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!page.title || !page.slug) {
        toast.error('Title and slug are required');
        return;
      }
      
      const payload = {
        ...page,
        sections: page.sections.map((section: any, index: number) => ({
          ...section,
          order: index,
        })),
      };
      
      if (pageId) {
        // Update existing page
        await axios.patch(`/api/admin/pages/${pageId}`, payload);
        toast.success('Page updated successfully');
      } else {
        // Create new page
        const response = await axios.post('/api/admin/pages', payload);
        toast.success('Page created successfully');
        router.push(`/admin/pages/edit/${response.data.id}`);
      }
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast.error(error.response?.data?.error || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };
  
  // Preview the page
  const handlePreview = () => {
    if (page.slug) {
      window.open(`/${page.slug}`, '_blank');
    } else {
      toast.error('Please set a slug first');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" />
      </div>
    );
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {pageId ? 'Edit Page' : 'Create New Page'}
          </h1>
          <div className="flex gap-2">
            {pageId && (
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!page.slug}
              >
                <FiEye className="mr-2" /> Preview
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving || !page.title || !page.slug}
            >
              {saving ? <Spinner size="small" className="mr-2" /> : <FiSave className="mr-2" />}
              Save
            </Button>
          </div>
        </div>
        
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Page Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={page.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => !page.slug && generateSlug()}
              required
            />
            <div className="flex gap-2 items-end">
              <Input
                label="Slug"
                value={page.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                required
                className="flex-grow"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={generateSlug}
                className="mb-[2px]"
              >
                Generate
              </Button>
            </div>
            <Textarea
              label="Description"
              value={page.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="md:col-span-2"
            />
            <Input
              label="Layout"
              value={page.layout}
              onChange={(e) => handleChange('layout', e.target.value)}
              placeholder="default"
            />
            <Input
              label="Featured Image URL"
              value={page.featuredImage}
              onChange={(e) => handleChange('featuredImage', e.target.value)}
            />
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium mb-2">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Meta Title"
                  value={page.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="Same as page title if empty"
                />
                <Input
                  label="Meta Description"
                  value={page.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="Same as page description if empty"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={page.isPublished}
                  onChange={(e) => handleChange('isPublished', e.target.checked)}
                  className="form-checkbox h-4 w-4"
                />
                <label className="text-sm">Published</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={page.isHomePage}
                  onChange={(e) => handleChange('isHomePage', e.target.checked)}
                  className="form-checkbox h-4 w-4"
                />
                <label className="text-sm">Set as Home Page</label>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Page Sections</h2>
            <ContentTypeSelector 
              onSelect={handleAddSection}
              existingTypes={page.sections.map((section: any) => section.type)}
            />
          </div>
          
          {page.sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No sections added yet. Use the "Add Section" button to add content to your page.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {page.sections.map((section: any, index: number) => (
                <Card key={index} className="p-4 border">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">
                      {section.name} 
                      <span className="ml-2 text-xs text-gray-500">({section.type})</span>
                    </h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleMoveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-1"
                      >
                        <FiArrowUp />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleMoveSection(index, 'down')}
                        disabled={index === page.sections.length - 1}
                        className="p-1"
                      >
                        <FiArrowDown />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleRemoveSection(index)}
                        className="text-red-500 p-1"
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </div>
                  <SectionEditor
                    section={section}
                    onChange={(updatedSection) => handleSectionChange(index, updatedSection)}
                  />
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DndProvider>
  );
};

export default PageEditor;
