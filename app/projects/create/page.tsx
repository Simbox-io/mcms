'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { TagInput } from '@/components/ui/tag-input';
import { Tag, User } from '@/lib/prisma';
import { UserInput } from '@/components/ui/user-input';

export default function CreateProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [visibilitySettings, setVisibilitySettings] = useState({
    visibility: 'PRIVATE',
  });
  const [collaborationSettings, setCollaborationSettings] = useState({
    allowCollaborators: false,
    collaboratorRoles: [],
  });
  const [notificationSettings, setNotificationSettings] = useState({
    notifyOnActivity: false,
    notifyOnMentions: false,
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        collaborators,
        tags,
        settings: {
          visibilitySettings,
          collaborationSettings,
          notificationSettings,
        },
      }),
    });

    if (response.ok) {
      toast({
        title: 'Project created.',
        description: 'Your project has been successfully created.',
      });
      router.push('/projects');
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">Create Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="collaborators">Collaborators</Label>
          <UserInput
            id="collaborators"
            selectedUsers={collaborators}
            onSelectUser={(user) => setCollaborators([...collaborators, user])}
            onRemoveUser={(user) => setCollaborators(collaborators.filter((c) => c !== user))}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="tags">Tags</Label>
          <TagInput
            id="tags"
            selectedTags={tags}
            onSelectTag={(tag) => setTags([...tags, tag])}
            onRemoveTag={(tag) => setTags(tags.filter((t) => t !== tag))}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="visibility">Visibility</Label>
          <Switch
            id="visibility"
            checked={visibilitySettings.visibility === 'PUBLIC'}
            onCheckedChange={(checked) =>
              setVisibilitySettings({ visibility: checked ? 'PUBLIC' : 'PRIVATE' })
            }
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="allowCollaborators">Allow Collaborators</Label>
          <Switch
            id="allowCollaborators"
            checked={collaborationSettings.allowCollaborators}
            onCheckedChange={(checked) =>
              setCollaborationSettings({ ...collaborationSettings, allowCollaborators: checked })
            }
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="notifyOnActivity">Notify on Activity</Label>
          <Switch
            id="notifyOnActivity"
            checked={notificationSettings.notifyOnActivity}
            onCheckedChange={(checked) =>
              setNotificationSettings({ ...notificationSettings, notifyOnActivity: checked })
            }
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="notifyOnMentions">Notify on Mentions</Label>
          <Switch
            id="notifyOnMentions"
            checked={notificationSettings.notifyOnMentions}
            onCheckedChange={(checked) =>
              setNotificationSettings({ ...notificationSettings, notifyOnMentions: checked })
            }
          />
        </div>
        <Button type="submit">Create Project</Button>
      </form>
    </div>
  );
}