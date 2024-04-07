'use client'

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, Space, Tag } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaRegBookmark } from 'react-icons/fa6';
import { bookmarkProject } from '@/app/actions/actions';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';

export function SpaceCard({ space }: { space: Space }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();
  const session = useUser();
  const user = session?.user;

  const handleBookmarkProject = async () => {
    if (user?.id) {
      await bookmarkProject(space.id, user.id);
    }
  }

  return (
    <>
      <Card className='min-w-96' onClick={() => router.push(`/spaces/${space.id}`)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{space.name}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{space.likes} Likes</Badge>
              <Badge variant="outline">{space.views.length} Views</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{space.description}</CardDescription>
        </CardContent>
        <CardFooter className='flex justify-between align-middle'>
            <div>
              <p className="text-sm text-zinc-500">Created {new Date(space.createdAt).toLocaleDateString()} by <HoverCard><HoverCardTrigger><u>{space.owner.username}</u></HoverCardTrigger><HoverCardContent> <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={space.owner.avatar || ''} alt={space.owner.username} />
              <AvatarFallback>{space.owner.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {space.owner.firstName} {space.owner.lastName}
              </p>
              <p className="text-sm text-zinc-500">@{space.owner.username}</p>
            </div>
          </div></HoverCardContent></HoverCard></p>
            </div>
            <div>
              <Button onClick={handleBookmarkProject} variant="ghost" size="sm"><FaRegBookmark /></Button>
            </div>
        </CardFooter>
      </Card>

    </>
  );
}