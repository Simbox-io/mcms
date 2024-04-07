import { FileCard } from '@/components/files/FileCard';
import { File } from '@/lib/prisma';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { getFiles } from '@/app/actions/actions';

export default async function FilePage() {
    const files = await getFiles() as unknown as File[];

    return (
      <>
      {files.length === 0 && (
            <EmptyState
            className='flex justify-center w-full space-y-4'
            title="No files found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={<Button variant='secondary'>Upload a file</Button>}
            buttonHref='/files/upload'
          />
          )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file: File) => (
            <FileCard file={file} key={file.id} />
          ))}
        </div>
        </>
    );
}

