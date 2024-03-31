'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { TagInput } from '@/components/ui/tag-input';
import { UserInput } from '@/components/ui/user-input';
import { Tag, User } from '@/lib/prisma';

interface Project {
  id: string;
  name: string;
  description: string;
  owner: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    createdAt: Date;
  };
  likes: number;
  views: number;
  collaborators: any[];
  files: any[];
  tags: any[];
  comments: any[];
  spaces: any[];
  createdAt: Date;
  updatedAt: Date;
  bookmarks: any[];
  settings: {
    visibilitySettings: {
      isPublic: boolean;
    };
    collaborationSettings: {
      allowRequests: boolean;
    };
    notificationSettings: {
      emailNotifications: boolean;
    };
  };
}

export default function EditProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTag, setNewTag] = useState<Tag | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newCollaborator, setNewCollaborator] = useState('');

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        setProject(data);
        setSelectedTags(data.tags);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Handle form submission and update project data
  }

  function handleRemoveTag(tag: Tag) {
    // Handle removing a tag from the project
  }

  function handleAddTag() {
    if (!newTag) return;
    setSelectedTags([...selectedTags, newTag]);
    setNewTag(null);
  }

  function handleRemoveCollaborator(collaborator: User) {
    // Handle removing a collaborator from the project
  }

  function handleAddCollaborator() {
    // Handle adding a new collaborator to the project
    setNewCollaborator('');
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" defaultValue={project.name} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={project.description} required />
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1"
                    >
                      <span>{tag.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <TagInput
                      showList={false}
                      selectedTags={selectedTags}
                      onSelectTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Collaborators</Label>
                <div className="flex flex-col space-y-2 mt-2">
                  {project.collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-md px-4 py-2"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={collaborator.avatar} alt={collaborator.username} />
                          <AvatarFallback>
                            {collaborator.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{collaborator.username}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <UserInput
                      showList={false}
                      selectedUsers={project.collaborators}
                      onSelectUser={handleAddCollaborator}
                      onRemoveUser={handleRemoveCollaborator}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Tabs defaultValue="settings">
                  <TabsList>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="spaces">Spaces</TabsTrigger>
                  </TabsList>
                  <TabsContent value="settings">
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center space-x-4">
                        <Switch
                          id="isPublic"
                          defaultChecked={project.settings.visibilitySettings.isPublic}
                        />
                        <Label htmlFor="isPublic">Public</Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch
                          id="allowRequests"
                          defaultChecked={project.settings.collaborationSettings.allowRequests}
                        />
                        <Label htmlFor="allowRequests">Allow Collaboration Requests</Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch
                          id="emailNotifications"
                          defaultChecked={project.settings.notificationSettings.emailNotifications}
                        />
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="spaces">
                    <div className="mt-4">
                      {/* Render project spaces */}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}