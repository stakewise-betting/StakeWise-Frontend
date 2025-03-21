"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import SettingsCard from "./SettingsCard"

export default function DangerZone() {
  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      console.log("Account deactivated")
    }
  }

  const handleDelete = () => {
    if (
      window.confirm(
        "WARNING: This action cannot be undone. Are you absolutely sure you want to delete your account permanently?",
      )
    ) {
      console.log("Account deleted")
    }
  }

  return (
    <SettingsCard title="Danger Zone" description="Irreversible account actions" titleColor="text-red-500">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-zinc-100">Deactivate Account</h3>
            <p className="text-sm text-zinc-400 mt-1">
              Temporarily disable your account. You can reactivate it anytime.
            </p>
          </div>
          <Button
            variant="outline"
            className="py-3 bg-red-500 border-none rounded-lg hover:bg-red-600"
            onClick={handleDeactivate}
          >
            Deactivate
          </Button>
        </div>

        <Separator className="bg-zinc-800" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-red-500">Delete Account</h3>
            <p className="text-sm text-zinc-400 mt-1">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive" className="sm:w-auto py-3 bg-red-500 border-none rounded-lg hover:bg-red-600" onClick={handleDelete}>
            Delete Account
          </Button>
        </div>
      </div>
    </SettingsCard>
  )
}

