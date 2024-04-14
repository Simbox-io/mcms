import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { getProjects } from "@/app/actions/actions"

export default async function ProjectsPanel() {
  const projects = await getProjects();
  return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Projects</h1>
          </div>
          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Spaces</TableHead>
                  <TableHead>Collaborators</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (     
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.owner.username}</TableCell>
                  <TableCell>{project.files.length}</TableCell>
                  <TableCell>{project.spaces.length}</TableCell>
                  <TableCell>{project.collaborators.length}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button className="ml-2" size="sm" variant="outline">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
))}
              </TableBody>
            </Table>
          </div>
        </main>
  )
}
