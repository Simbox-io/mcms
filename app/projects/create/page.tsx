// app/projects/create/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToken } from '../../../lib/useToken';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Select from '../../../components/Select';
import FileUpload from '../../../components/FileUpload';
import TagInput from '../../../components/TagInput';
import FormGroup from '../../../components/FormGroup';
import { Editor } from '@tinymce/tinymce-react';
import { User } from '../../../lib/prisma';
import { motion } from 'framer-motion';

const CreateProjectPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repository, setRepository] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const token = useToken();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };
    getUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Upload files first
      const uploadResults = await Promise.all(
        selectedFiles.map((file) => handleUpload(file))
      );
      // Filter out successful uploads
      const successfulUploads = uploadResults.filter((result) => result.success);
      const filePaths = successfulUploads.map((result) => result.path);
      // Check for failed uploads
      const failedUploads = uploadResults.filter((result) => !result.success);
      if (failedUploads.length > 0) {
        // Display error messages for failed uploads
        failedUploads.forEach((result) => {
          console.error(`Error uploading file: ${result.file.name}`, result.error);
          // You can display the error message to the user using a toast or alert
        });
      }

      const formData = {
        name,
        description,
        repository,
        members: selectedMembers,
        files: filePaths,
        //tags: selectedTags,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/projects/${name}`);
      } else {
        console.error('Error creating project:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
    setIsSubmitting(false);
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const users: User[] = await response.json();
        return users;
      } else {
        console.error('Error fetching users:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const selectedFiles = Array.from(files);
      setSelectedFiles(selectedFiles);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('description', '');
    formData.append('isPublic', 'true');
    formData.append('contentType', file.type);


    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, path: data.url, file };
      } else {
        console.error('Error uploading file:', response.statusText);
        return { success: false, error: response.statusText, file };
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message, file };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="max-w-3xl mx-auto shadow-lg">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-white">Create Project</h1>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Project Name" htmlFor="name">
                <Input
                  name="name"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </FormGroup>
              <FormGroup label="Repository" htmlFor="repository">
                <Input
                  name="repository"
                  type="text"
                  id="repository"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  className="w-full"
                />
              </FormGroup>
            </div>
            <FormGroup label="Description" htmlFor="description" className="mt-6">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                onEditorChange={(content) => setDescription(content)}
                init={{
                  height: 300,
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
            </FormGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormGroup label="Members" htmlFor="members">
                <Select
                  id="members"
                  options={users.map((user) => ({ value: user.id, label: user.username }))}
                  value={selectedMembers}
                  onChange={(memberIds) =>
                    setSelectedMembers(Array.isArray(memberIds) ? memberIds.map(String) : [])
                  }
                  isMulti
                  placeholder="Select project members"
                  className="w-full"
                />
              </FormGroup>
              <FormGroup label="Tags" htmlFor="tags">
                <TagInput
                  id="tags"
                  tags={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Add tags..."
                />
              </FormGroup>
            </div>
            <FormGroup label="Files" htmlFor="files" className="mt-6">
              <FileUpload
                id="files"
                onFileSelect={handleFileSelect}
                onFileUpload={() => handleUpload}
                accept="*"
                maxFiles={10}
                showButton={false}
              />
            </FormGroup>
            <div className="mt-8">
              <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  );
};

export default CreateProjectPage;