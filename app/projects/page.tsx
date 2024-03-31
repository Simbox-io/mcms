'use client'
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { FaCog } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

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
    settings: any;
}

export default function ProjectPage() {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch('/api/projects?page=1');
                const data = await res.json();
                setProject(data.projects[0]);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                setIsLoading(false);
            }
        }

        fetchProject();
    }, []);

    if (isLoading) {
        return <ProjectSkeleton />;
    }

    if (!project) {
        return <div>Project not found.</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{project.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Badge variant="outline">{project.likes} Likes</Badge>
                            <Badge variant="outline">{project.views} Views</Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    {project.owner.id === user?.id ? <FaCog /> : null}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}/edit`)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className='text-red-500' onClick={() => setDeleteModalOpen(true)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                        <Avatar>
                            <AvatarImage src={project.owner.avatar} alt={project.owner.username} />
                            <AvatarFallback>{project.owner.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {project.owner.firstName} {project.owner.lastName}
                            </p>
                            <p className="text-sm text-gray-500">@{project.owner.username}</p>
                        </div>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="files">Files</TabsTrigger>
                                <TabsTrigger value="comments">Comments</TabsTrigger>
                                <TabsTrigger value="spaces">Spaces</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview">
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium mb-2">Collaborators</h3>
                                    <AvatarGroup>
                                        {project.collaborators.map((collaborator) => (
                                            <HoverCard key={collaborator.id}>
                                                <HoverCardTrigger>
                                                    <Avatar key={collaborator.id}>
                                                        <AvatarImage src={collaborator.avatar} alt={collaborator.username} />
                                                        <AvatarFallback>
                                                            {collaborator.username.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </HoverCardTrigger>
                                                <HoverCardContent>
                                                    <p>{collaborator.username}</p>
                                                </HoverCardContent>
                                            </HoverCard>
                                        ))}
                                    </AvatarGroup>
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
                                    {/* Render recent activity */}
                                </div>
                            </TabsContent>
                            <TabsContent value="files">
                                <div className="mt-4">
                                    {/* Render project files */}
                                </div>
                            </TabsContent>
                            <TabsContent value="comments">
                                <div className="mt-4">
                                    {/* Render project comments */}
                                </div>
                            </TabsContent>
                            <TabsContent value="spaces">
                                <div className="mt-4">
                                    {/* Render project spaces */}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
            {deleteModalOpen ? (
                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <DialogTrigger />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Project</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>Are you sure you want to delete this project?</DialogDescription>
                        <DialogFooter>
                            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                            <Button variant="destructive">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : null}
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

function AvatarGroup({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex -space-x-2">
            {children}
        </div>
    );
}