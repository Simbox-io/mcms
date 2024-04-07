
import { SpaceCard } from '@/components/spaces/SpaceCard';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { getSpaces } from '@/app/actions/actions';
import { Space } from '@/lib/prisma';

export default async function SpacePage() {
    const spaces = await getSpaces() as unknown as Space[];

    return (
        <>
            {spaces.length === 0 && (
                <EmptyState
                    className='flex justify-center w-full space-y-4'
                    title="No spaces found"
                    description="Create a new space to get started."
                    action={<Button>Create a new space</Button>}
                    buttonHref='/spaces/create'
                />
            )}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {spaces.map((space: Space) => (
                    <SpaceCard space={space} key={space.id} />
                ))}
            </div>
        </>
    );
}

