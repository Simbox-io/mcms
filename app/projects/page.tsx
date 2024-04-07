import { ProjectCard } from '@/components/projects/ProjectCard';
import { redirect } from 'next/navigation';
import { Project } from '@/lib/prisma';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { FaSadTear } from 'react-icons/fa';
import { getProjects } from '@/app/actions/actions';

export default async function ProjectPage() {
    const projects = await getProjects() as unknown as Project[];

    if (!projects) {
        return <EmptyState icon={<FaSadTear/>} className='mb-8' title="No projects found" description="Create a new project to get started." action={<Button onClick={() => redirect('/projects/create')}>Create a new project</Button>} />;
    }

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: Project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
    );
}

