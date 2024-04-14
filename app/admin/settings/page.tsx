import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import S3Settings from "@/components/admin/settings/s3"
import SESSettings from "@/components/admin/settings/ses"
import FTPSettings from "@/components/admin/settings/ftp"

export default function SettingsPanel() {
  return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Settings</h1>
          </div>
          <div className="rounded-lg">
           <div className="container flex flex-col space-y-4 justify-around">
            <S3Settings/>
            <SESSettings/>
            <FTPSettings/>
           </div>
          </div>
        </main>
  )
}
