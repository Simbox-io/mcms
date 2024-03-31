// app/projects/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { User } from '@/lib/prisma';

// Custom component for displaying tags
const TagBadge = ({ tag }: { tag: string }) => (
  <Badge variant="outline">{tag}</Badge>
);

// Custom component for displaying collaborators
const CollaboratorAvatar = ({ collaborator }: { collaborator: User }) => (
  <Avatar>
    <AvatarImage src={collaborator.avatar || ''} alt={collaborator.username} />
    <AvatarFallback>{collaborator.username.slice(0, 2)}</AvatarFallback>
  </Avatar>
);

const ProjectPage = async ({ params }: { params: { id: string } }) => {
  const res = await fetch(`/api/projects/${params.id}`, { cache: 'no-store' });
  const project = await res.json();

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={project.owner.profileImageUrl} alt={project.owner.username} />
                <AvatarFallback>{project.owner.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{project.owner.username}</p>
                <p className="text-sm text-muted-foreground">Owner</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: { name: string }) => (
                <TagBadge key={tag.name} tag={tag.name} />
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Collaborators:</span>
              <div className="flex -space-x-2">
                {project.collaborators.map((collaborator: User) => (
                  <CollaboratorAvatar key={collaborator.id} collaborator={collaborator} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Created at: {format(new Date(project.createdAt), 'MMM dd, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(project.updatedAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Likes: {project.likes}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Views: {project.views}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="mb-2 text-lg font-medium">Settings</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Input id="visibility" value={project.settings?.visibilitySettings?.visibility || 'Private'} readOnly />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="allowCollaborators">Allow Collaborators</Label>
                  <Input
                    id="allowCollaborators"
                    value={project.settings?.collaborationSettings?.allowCollaborators ? 'Yes' : 'No'}
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="collaboratorRoles">Collaborator Roles</Label>
                  <Textarea
                    id="collaboratorRoles"
                    value={project.settings?.collaborationSettings?.collaboratorRoles.join(', ') || ''}
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="notifyOnActivity">Notify on Activity</Label>
                  <Input
                    id="notifyOnActivity"
                    value={project.settings?.notificationSettings?.notifyOnActivity ? 'Yes' : 'No'}
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="notifyOnMentions">Notify on Mentions</Label>
                  <Input
                    id="notifyOnMentions"
                    value={project.settings?.notificationSettings?.notifyOnMentions ? 'Yes' : 'No'}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Edit Project</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectPage;