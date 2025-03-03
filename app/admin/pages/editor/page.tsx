'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FiEdit, FiTrash, FiPlus, FiArrowUp, FiArrowDown, FiGrid, FiType, FiImage, FiLayout, FiX } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Textarea from '@/components/next-gen/Textarea';
import Spinner from '@/components/base/Spinner';
import { useToast } from '@/hooks/use-toast';
import { Page, PageSection, PageContentType } from '@/lib/prisma';
import SectionEditor from '@/components/admin/SectionEditor';
import ContentTypeSelector from '@/components/admin/ContentTypeSelector';

const PageEditor = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get('id');
  const { toast } = useToast();
  
  const [page, setPage] = useState<Partial<Page>>({
    title: '',
    slug: '',
    description: '',
    isPublished: false,
    isHomePage: false,
    layout: 'default',
    sections: [],
    contentTypes: []
  });
  const [loading, setLoading] = useState(!!pageId);
  const [saving, setSaving] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);

  // Fetch page data if editing
  useEffect(() => {
    if (pageId) {
      const fetchPage = async () => {
        try {
          const response = await axios.get(`/api/admin/pages/${pageId}`);
          setPage(response.data);
        } catch (error) {
          console.error('Error fetching page:', error);
          toast({ title: 'Error', description: 'Failed to load page', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };
      fetchPage();
    }
  }, [pageId, toast]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sections = Array.from(page.sections || []);
    const [removed] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, removed);
    
    setPage(prev => ({ ...prev, sections }));
  };

  const handleAddSection = (type: string) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      name: `New ${type} Section`,
      type,
      content: null,
      order: page.sections?.length || 0,
      isEnabled: true,
      settings: {}
    };
    
    setPage(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
  };

  const handleSectionChange = (index: number, updatedSection: PageSection) => {
    const sections = [...(page.sections || [])];
    sections[index] = updatedSection;
    setPage(prev => ({ ...prev, sections }));
  };

  const handleRemoveSection = (index: number) => {
    const sections = [...(page.sections || [])];
    sections.splice(index, 1);
    setPage(prev => ({ ...prev, sections }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (pageId) {
        await axios.patch(`/api/admin/pages/${pageId}`, page);
      } else {
        await axios.post('/api/admin/pages', page);
      }
      toast({ title: 'Success', description: 'Page saved successfully' });
      router.push('/admin/pages');
    } catch (error) {
      console.error('Error saving page:', error);
      toast({ title: 'Error', description: 'Failed to save page', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout 
      title={pageId ? 'Edit Page' : 'Create Page'} 
      description="Build your page with drag-and-drop sections"
    >
      <div className="space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Page Title"
              value={page.title}
              onChange={(e) => setPage(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <Input
              label="Slug"
              value={page.slug}
              onChange={(e) => setPage(prev => ({ ...prev, slug: e.target.value }))}
              prefix="/"
              required
            />
          </div>
          
          <Textarea
            label="Description"
            value={page.description || ''}
            onChange={(e) => setPage(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={page.isPublished}
                onChange={(e) => setPage(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="form-checkbox h-4 w-4"
              />
              <label className="text-sm">Published</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={page.isHomePage}
                onChange={(e) => setPage(prev => ({ ...prev, isHomePage: e.target.checked }))}
                className="form-checkbox h-4 w-4"
              />
              <label className="text-sm">Home Page</label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Page Sections</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {(page.sections || []).map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps} className="handle cursor-move p-1">
                                  <FiGrid className="text-gray-400" />
                                </div>
                                <span className="font-medium">{section.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setActiveSectionIndex(activeSectionIndex === index ? null : index)}
                                >
                                  {activeSectionIndex === index ? 'Collapse' : 'Edit'}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemoveSection(index)}
                                >
                                  <FiTrash className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {activeSectionIndex === index && (
                              <SectionEditor
                                section={section}
                                onChange={(updatedSection) => handleSectionChange(index, updatedSection)}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          
          <div className="mt-4">
            <ContentTypeSelector
              onSelect={handleAddSection}
              existingTypes={(page.sections || []).map(s => s.type)}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push('/admin/pages')} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="small" className="mr-2" /> : null}
            {saving ? 'Saving...' : 'Save Page'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PageEditor;
