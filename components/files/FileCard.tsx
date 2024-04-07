'use client'

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { File } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaRegBookmark } from 'react-icons/fa6';
import { bookmarkFile } from '@/app/actions/actions';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';

export function FileCard({ file }: { file: File }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();
  const session = useUser();
  const user = session?.user;

  const handleBookmarkFile = async () => {
    if (user?.id) {
      await bookmarkFile(file.id, user.id);
    }
  }

  return (
    <>
      <Card className='min-w-96' onClick={() => router.push(`/Files/${file.id}`)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{file.name}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{file.likes} Likes</Badge>
              <Badge variant="outline">{file.views} Views</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{file.description}</CardDescription>
          <div className="mt-6 flex flex-wrap gap-2">
            {file.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className='flex justify-between align-middle'>
            <div>
              <p className="text-sm text-zinc-500">Created {new Date(file.createdAt).toLocaleDateString()} by <HoverCard><HoverCardTrigger><u>{file.uploadedBy.username}</u></HoverCardTrigger><HoverCardContent> <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={file.uploadedBy.avatar || ''} alt={file.uploadedBy.username} />
              <AvatarFallback>{file.uploadedBy.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {file.uploadedBy.firstName} {file.uploadedBy.lastName}
              </p>
              <p className="text-sm text-zinc-500">@{file.uploadedBy.username}</p>
            </div>
          </div></HoverCardContent></HoverCard></p>
            </div>
            <div>
              <Button onClick={handleBookmarkFile} variant="ghost" size="sm"><FaRegBookmark /></Button>
            </div>
        </CardFooter>
      </Card>

    </>
  );
}