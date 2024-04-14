// app/projects/[id]/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { User, Project, Tag } from '@/lib/prisma';
import { Task } from '@prisma/client';
import { getProject } from '@/app/actions/actions';
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getTasks } from "@/app/actions/actions"
import FileTree from "@/components/projects/FileTree"

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
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    const fetchProject = async () => {
      const project = await getProject(params.id);
      const tasks = await getTasks(params.id);
      setTasks(tasks);
      setProject(project as unknown as Project);
    };
    fetchProject();
  }, [params.id]);

  return (
    <main className="flex flex-col w-full h-full p-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${project?.id}`}>{project?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col mt-6 space-y-4 w-full lg:flex-row lg:space-x-4 lg:space-y-0 lg:justify-between">
        <Card className="w-full max-w-4xl mx-auto rounded-lg shadow-md">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6">
            <div className="space-y-2">
              <CardTitle className="text-lg sm:text-2xl font-bold">{project?.name}</CardTitle>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Avatar>
                <AvatarImage alt="Owner's Avatar" src="/placeholder-avatar.jpg" />
                <AvatarFallback>OP</AvatarFallback>
              </Avatar>
              <span className="text-sm">{project?.owner.username}</span>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-2 mb-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{project?.description}</p>
          </CardContent>
          <CardFooter>
            {project?.collaborators.length === 0 && (<p className="text-sm text-zinc-500 dark:text-zinc-400">No collaborators</p>)}
            {project?.collaborators.map((collaborator) => (
              <CollaboratorAvatar key={collaborator.id} collaborator={collaborator} />
            ))}
          </CardFooter>
        </Card>
        <Card className="w-full h-full lg:w-80">
          <CardHeader className='flex flex-row justify-between align-middle'>
            <CardTitle className='text-lg'>Details</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="ml-auto" size="icon" variant="ghost">
                  <MoreHorizontalIcon className="w-4 h-4" />
                  <span className="sr-only">Project settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuItem>Delete Project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap text-sm text-zinc-500 dark:text-zinc-400 items-center space-x-2">
              {project?.tags.length === 0 && (<p>No tags</p>)}
              {project?.tags.map((tag: Tag) => (
                <span key={tag.id} className="inline-block bg-blue-100 text-blue-500 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex text-sm items-center space-x-1 text-zinc-500 dark:text-zinc-400">
              <span>Created: {new Date(project?.createdAt || '').toLocaleDateString()}</span>
            </div>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">Last updated: {project?.updatedAt ? new Date(project?.updatedAt).toLocaleDateString() : 'No updates'}</span>
            <div className="flex flex-row items-center space-x-4 mt-4">
              <div className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-400">
                <HeartIcon className="w-4 h-4" />
                <span>{project?.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-400">
                <EyeIcon className="w-4 h-4" />
                <span>{project?.views || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs className="w-full max-w-5xl mx-auto mt-6" defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="spaces">Spaces</TabsTrigger>
          <TabsTrigger value="repository">Repository</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card className="w-full mx-auto mt-4 rounded-lg shadow-md overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold">Tasks</CardTitle>
            </CardHeader>
            <CardContent className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Labels</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">No tasks found</TableCell>
                    </TableRow>
                  )}
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</TableCell>
                      <TableCell className="text-right">{task.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">{tasks.length}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="issues">
          <Card className="w-full mx-auto mt-4 rounded-lg shadow-md overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold">Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Labels</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">No issues found</TableCell>
                    </TableRow>
                  )}
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</TableCell>
                      <TableCell className="text-right">{task.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">{tasks.length}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="spaces">
          <Card className="w-full mx-auto mt-4 rounded-lg shadow-md overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold">Spaces</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-2">
                <li>Space 1</li>
                <li>Space 2</li>
                <li>Space 3</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="repository">
          <Card className="w-full mx-auto mt-4 rounded-lg shadow-md overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold">Repository</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-row border border-round">
              <div>
                <FileTree />
              </div>
              <div>
                <span>Files will view here for editing</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function EyeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function HeartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function MoreHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}

export default ProjectPage