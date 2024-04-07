'use'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="container mt-4 mx-auto max-w-[800px] space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create New Space</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter the details for your new space</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="space-name">Space Name</Label>
          <Input id="space-name" placeholder="Enter space name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="space-key">Space Key</Label>
          <Input id="space-key" placeholder="Enter space key" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="space-description">Space Description</Label>
          <Textarea className="min-h-[100px]" id="space-description" placeholder="Enter space description" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="space-project">Project Link</Label>
          <Input id="space-project" placeholder="Enter project link" required />
        </div>
        <Button className="w-full mt-6" type="submit">
          Create Space
        </Button>
      </div>
    </div>
  )
}

