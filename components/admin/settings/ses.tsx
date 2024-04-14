import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SESSettings() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Amazon SES Configuration</CardTitle>
        <CardDescription>Configure your connection to Amazon SES.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accessKey">Access Key</Label>
          <Input id="accessKey" placeholder="Enter your access key" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secretKey">Secret Key</Label>
          <Input id="secretKey" placeholder="Enter your secret key" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input id="emailAddress" placeholder="Enter your email address" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input id="region" placeholder="Enter your region" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto">Save</Button>
      </CardFooter>
    </Card>
  )
}