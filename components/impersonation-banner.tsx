import { AlertTitle, AlertDescription, Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { User } from "@/lib/prisma"

export function ImpersonationBanner({ user }: { user: User }) {
  return (
    <Alert className="bg-yellow-200 dark:bg-yellow-700 p-4 rounded-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <UserIcon className="h-6 w-6 text-yellow-800 dark:text-yellow-300" />
        <div className="text-yellow-800 dark:text-yellow-300">
          <AlertTitle className="font-semibold">Impersonation Mode</AlertTitle>
          <AlertDescription>You are currently impersonating {user.username}.</AlertDescription>
        </div>
      </div>
      <Button
        className="text-yellow-800 dark:text-yellow-300 border-yellow-800 dark:border-yellow-300"
        variant="outline"
      >
        End Impersonation
      </Button>
    </Alert>
  )
}


function UserIcon(props: any) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
