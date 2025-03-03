'use client';
import React from 'react';
import Input from '@/components/next-gen/Input';
import Textarea from '@/components/next-gen/Textarea';

interface SectionEditorProps {
  section: any;
  onChange: (section: any) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onChange }) => {
  const handleContentChange = (field: string, value: any) => {
    onChange({
      ...section,
      content: {
        ...(section.content || {}),
        [field]: value
      }
    });
  };

  return (
    <div className="mt-4 space-y-4">
      <Input
        label="Section Name"
        value={section.name}
        onChange={(e) => onChange({ ...section, name: e.target.value })}
      />
      
      {section.type === 'content' && (
        <Textarea
          label="Content"
          value={(section.content as any)?.text || ''}
          onChange={(e) => handleContentChange('text', e.target.value)}
          rows={6}
        />
      )}

      {section.type === 'hero' && (
        <div className="space-y-4">
          <Input
            label="Heading"
            value={(section.content as any)?.heading || ''}
            onChange={(e) => handleContentChange('heading', e.target.value)}
          />
          <Textarea
            label="Subheading"
            value={(section.content as any)?.subheading || ''}
            onChange={(e) => handleContentChange('subheading', e.target.value)}
            rows={2}
          />
          <Input
            label="Background Image URL"
            value={(section.content as any)?.backgroundImage || ''}
            onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(section.content as any)?.hasButton || false}
              onChange={(e) => handleContentChange('hasButton', e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            <label className="text-sm">Include Button</label>
          </div>
          {(section.content as any)?.hasButton && (
            <>
              <Input
                label="Button Text"
                value={(section.content as any)?.buttonText || ''}
                onChange={(e) => handleContentChange('buttonText', e.target.value)}
              />
              <Input
                label="Button URL"
                value={(section.content as any)?.buttonUrl || ''}
                onChange={(e) => handleContentChange('buttonUrl', e.target.value)}
              />
            </>
          )}
        </div>
      )}

      {section.type === 'gallery' && (
        <div className="space-y-4">
          <Input
            label="Gallery Title"
            value={(section.content as any)?.title || ''}
            onChange={(e) => handleContentChange('title', e.target.value)}
          />
          <Textarea
            label="Gallery Description"
            value={(section.content as any)?.description || ''}
            onChange={(e) => handleContentChange('description', e.target.value)}
            rows={2}
          />
          {/* Image URLs would be managed here with add/remove functionality */}
          <div className="border p-3 rounded-md">
            <p className="text-sm text-gray-500 mb-2">Image URLs (one per line)</p>
            <Textarea
              value={(section.content as any)?.images?.join('\n') || ''}
              onChange={(e) => handleContentChange('images', e.target.value.split('\n').filter(Boolean))}
              rows={4}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>
        </div>
      )}

      {section.type === 'cta' && (
        <div className="space-y-4">
          <Input
            label="CTA Title"
            value={(section.content as any)?.title || ''}
            onChange={(e) => handleContentChange('title', e.target.value)}
          />
          <Textarea
            label="CTA Description"
            value={(section.content as any)?.description || ''}
            onChange={(e) => handleContentChange('description', e.target.value)}
            rows={2}
          />
          <Input
            label="Button Text"
            value={(section.content as any)?.buttonText || ''}
            onChange={(e) => handleContentChange('buttonText', e.target.value)}
          />
          <Input
            label="Button URL"
            value={(section.content as any)?.buttonUrl || ''}
            onChange={(e) => handleContentChange('buttonUrl', e.target.value)}
          />
          <Input
            label="Background Color"
            value={(section.content as any)?.backgroundColor || ''}
            onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
            placeholder="#f3f4f6"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={section.isEnabled}
          onChange={(e) => onChange({ ...section, isEnabled: e.target.checked })}
          className="form-checkbox h-4 w-4"
        />
        <label className="text-sm">Enable Section</label>
      </div>
    </div>
  );
};

export default SectionEditor;
