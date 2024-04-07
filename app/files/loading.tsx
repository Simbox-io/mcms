import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="container mx-auto py-8">
            <ProjectSkeleton />
        </div>
    );
}

function ProjectSkeleton() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-1/3 rounded-md" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-16 rounded-md" />
                            <Skeleton className="h-4 w-16 rounded-md" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                            <Skeleton className="h-4 w-32 rounded-md" />
                            <Skeleton className="h-3 w-24 rounded-md mt-2" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-full rounded-md mt-4" />
                    <Skeleton className="h-4 w-full rounded-md mt-2" />
                    <Skeleton className="h-4 w-2/3 rounded-md mt-2" />
                    <div className="mt-6 flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-6 w-16 rounded-md" />
                    </div>
                    <div className="mt-6">
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

