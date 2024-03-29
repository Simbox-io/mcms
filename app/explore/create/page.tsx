// app/posts/create/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToken } from '../../../lib/useToken';
import Input from '../../../components/next-gen/Input';
import Textarea from '../../../components/next-gen/Textarea';
import Button from '../../../components/next-gen/Button';
import Card from '../../../components/next-gen/Card';
import Select from '../../../components/next-gen/Select';
import { Tag } from '../../../types/tag';
import { Editor } from '@tinymce/tinymce-react';
import Accordion from '../../../components/next-gen/Accordion';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<{ value: string, label: string }[]>([]);
  const [settings, setSettings] = useState({
    defaultVisibility: 'PUBLIC',
    commentSettings: {
      allowComments: true,
      moderateComments: false,
      comment: '',
    },
    sharingSettings: {
      allowSharing: true,
      sharePlatforms: [],
    },
    revisionHistorySettings: {
      revisionsToKeep: 10,
    },
  });

  const router = useRouter();
  const token = useToken();

  useEffect(() => {
    const fetchTags = async (): Promise<Tag[]> => {
      try {
        const response = await fetch('/api/tags', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const tags: Tag[] = await response.json();
          return tags;
        } else {
          console.error('Error fetching tags:', response.statusText);
          return [];
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
        return [];
      }
    };

    const fetchAndSetTags = async () => {
      const fetchedTags = await fetchTags();
      const options = fetchedTags.map(tag => ({ value: tag.id.toString(), label: tag.name }));
      setTags(options);
    };

    fetchAndSetTags();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags: selectedTags || [], settings }),
      });
      if (response.ok) {
        router.push('/explore/posts');
      } else {
        console.error('Error creating post:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setIsSubmitting(false);
  };

  const handleSettingsChange = (field: string, value: any) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Create Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              label="Title"
              type="text"
              value={title}
              onChange={setTitle}
              required
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help',
              }}
            />
          </div>
          <div className="mb-6">
            {/*<Select
              label="Tags"
              options={tags}
              value
              value={selectedTags}
              onChange={(tags) => setSelectedTags(Array.isArray(tags) ? tags : [tags])}
             isMulti
            />*/}
          </div>
          <div className="flex justify-end">
            <Button variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form >
      </Card >
    </div >
  );
};

export default CreatePostPage;