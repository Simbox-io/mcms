import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function FTPSettings() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>FTP Storage Configuration</CardTitle>
        <CardDescription>Configure your connection to FTP storage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ftpHost">FTP Host</Label>
          <Input id="ftpHost" placeholder="Enter your FTP host" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ftpUsername">FTP Username</Label>
          <Input id="ftpUsername" placeholder="Enter your FTP username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ftpPassword">FTP Password</Label>
          <Input id="ftpPassword" placeholder="Enter your FTP password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ftpPort">FTP Port</Label>
          <Input id="ftpPort" placeholder="Enter your FTP port" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto">Save</Button>
      </CardFooter>
    </Card>
  )
}