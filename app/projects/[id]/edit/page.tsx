'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/base/Card';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import Button from '@/components/next-gen/Button';
import Select from '@/components/next-gen/Select';
import Checkbox from '@/components/next-gen/Checkbox';
import Accordion from '@/components/next-gen/Accordion';

const visibilityOptions = [
  { value: 'PRIVATE', label: 'Private' },
  { value: 'PUBLIC', label: 'Public' },
];

const collaboratorRoleOptions = [
  { value: 'VIEWER', label: 'Viewer' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'ADMIN', label: 'Admin' },
];

const ProjectSettingsPage: React.FC = () => {
  const projectId = useParams();
  const router = useRouter();
  const [visibility, setVisibility] = useState('PRIVATE');
  const [allowCollaborators, setAllowCollaborators] = useState(true);
  const [collaboratorRoles, setCollaboratorRoles] = useState<string[]>([]);
  const [notifyOnActivity, setNotifyOnActivity] = useState(true);
  const [notifyOnMentions, setNotifyOnMentions] = useState(true);

  const handleSaveSettings = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            visibility,
            collaborationSettings: {
              allowCollaborators,
              collaboratorRoles,
            },
            notificationSettings: {
              notifyOnActivity,
              notifyOnMentions,
            },
          },
        }),
      });

      if (response.ok) {
        console.log('Project settings saved successfully');
        router.push(`/projects/${projectId.id}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to save project settings:', errorData.message);
        // Handle error (could add a toast notification here)
      }
    } catch (error) {
      console.error('Error saving project settings:', error);
      // Handle error (could add a toast notification here)
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Breadcrumbs
        items={[
          { label: 'Projects', href: '/projects' },
          { label: 'Project Name', href: '/projects/[id]' },
          { label: 'Settings', href: '/projects/[id]/settings' },
        ]}
        linkId={projectId.id as string}
      />
      <h1 className="text-3xl font-bold mb-4">Project Settings</h1>
      <div className='relative'>
        <Card className="mb-8" >
          <h2 className="text-xl font-semibold mb-4">Visibility Settings</h2>
          <Select
            options={visibilityOptions}
            value={visibility}
            onChange={(value) => setVisibility(value as string)}
          />
        </Card>
      </div>
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Collaboration Settings</h2>
        <Checkbox
          label="Allow collaborators"
          checked={allowCollaborators}
          onChange={setAllowCollaborators}
          className="mb-4"
        />
        {allowCollaborators && (
          <Select
            options={collaboratorRoleOptions}
            value={collaboratorRoles.toString()}
            onChange={(value) => setCollaboratorRoles(value as any)}
          />
        )}
      </Card>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <Accordion
          items={[
            {
              title: 'Activity',
              content: (
                <Checkbox
                  label="Notify on activity"
                  checked={notifyOnActivity}
                  onChange={setNotifyOnActivity}
                />
              ),
            },
            {
              title: 'Mentions',
              content: (
                <Checkbox
                  label="Notify on mentions"
                  checked={notifyOnMentions}
                  onChange={setNotifyOnMentions}
                />
              ),
            },
          ]}
        />
      </Card>
      <div className="flex justify-end mt-8">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};

export default ProjectSettingsPage;